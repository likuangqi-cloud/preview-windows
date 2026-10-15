use image::{imageops, DynamicImage, GenericImageView, ImageFormat};
use serde::{Deserialize, Serialize};
use std::io::Cursor;

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct ColorAdjustParams {
    pub exposure: f32,    // -100 to 100
    pub contrast: f32,    // -100 to 100
    pub saturation: f32,  // -100 to 100
    pub brightness: f32,  // -100 to 100
    pub sepia: f32,       // 0 to 100
}

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct ResizeParams {
    pub width: u32,
    pub height: u32,
    pub filter: String, // "lanczos3", "nearest", "triangle", "gaussian"
}

pub fn rotate_image_bytes(bytes: &[u8], degrees: i32) -> Result<Vec<u8>, String> {
    let img = image::load_from_memory(bytes).map_err(|e| e.to_string())?;
    let rotated = match degrees % 360 {
        90 | -270 => img.rotate90(),
        180 | -180 => img.rotate180(),
        270 | -90 => img.rotate270(),
        _ => img,
    };
    let mut out = Cursor::new(Vec::new());
    rotated.write_to(&mut out, ImageFormat::Png).map_err(|e| e.to_string())?;
    Ok(out.into_inner())
}

pub fn flip_image_bytes(bytes: &[u8], horizontal: bool) -> Result<Vec<u8>, String> {
    let img = image::load_from_memory(bytes).map_err(|e| e.to_string())?;
    let flipped = if horizontal {
        img.fliph()
    } else {
        img.flipv()
    };
    let mut out = Cursor::new(Vec::new());
    flipped.write_to(&mut out, ImageFormat::Png).map_err(|e| e.to_string())?;
    Ok(out.into_inner())
}

pub fn resize_image_bytes(bytes: &[u8], params: ResizeParams) -> Result<Vec<u8>, String> {
    let img = image::load_from_memory(bytes).map_err(|e| e.to_string())?;
    let filter = match params.filter.as_str() {
        "nearest" => imageops::FilterType::Nearest,
        "triangle" => imageops::FilterType::Triangle,
        "gaussian" => imageops::FilterType::Gaussian,
        _ => imageops::FilterType::Lanczos3,
    };
    let resized = img.resize_exact(params.width, params.height, filter);
    let mut out = Cursor::new(Vec::new());
    resized.write_to(&mut out, ImageFormat::Png).map_err(|e| e.to_string())?;
    Ok(out.into_inner())
}

pub fn adjust_color_bytes(bytes: &[u8], params: ColorAdjustParams) -> Result<Vec<u8>, String> {
    let mut img = image::load_from_memory(bytes).map_err(|e| e.to_string())?;
    
    // Brightness
    if params.brightness != 0.0 {
        let b = (params.brightness * 2.55) as i32;
        img = img.brighten(b);
    }
    
    // Contrast
    if params.contrast != 0.0 {
        img = img.adjust_contrast(params.contrast);
    }

    let mut out = Cursor::new(Vec::new());
    img.write_to(&mut out, ImageFormat::Png).map_err(|e| e.to_string())?;
    Ok(out.into_inner())
}

pub fn convert_format_bytes(bytes: &[u8], target_format: &str, _quality: Option<u8>) -> Result<Vec<u8>, String> {
    let img = image::load_from_memory(bytes).map_err(|e| e.to_string())?;
    let mut out = Cursor::new(Vec::new());
    match target_format.to_lowercase().as_str() {
        "jpeg" | "jpg" => {
            let rgb = img.to_rgb8();
            image::DynamicImage::ImageRgb8(rgb)
                .write_to(&mut out, ImageFormat::Jpeg)
                .map_err(|e| e.to_string())?;
        }
        "webp" => {
            img.write_to(&mut out, ImageFormat::WebP).map_err(|e| e.to_string())?;
        }
        "tiff" => {
            img.write_to(&mut out, ImageFormat::Tiff).map_err(|e| e.to_string())?;
        }
        "bmp" => {
            img.write_to(&mut out, ImageFormat::Bmp).map_err(|e| e.to_string())?;
        }
        _ => {
            img.write_to(&mut out, ImageFormat::Png).map_err(|e| e.to_string())?;
        }
    }
    Ok(out.into_inner())
}
