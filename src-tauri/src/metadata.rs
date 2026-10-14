use serde::{Deserialize, Serialize};
use std::fs::File;
use std::io::BufReader;
use std::path::Path;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ImageMetadata {
    pub file_name: String,
    pub file_size_bytes: u64,
    pub format: String,
    pub width: u32,
    pub height: u32,
    pub color_model: String,
    pub bit_depth: String,
    pub exif: Option<ExifData>,
    pub gps: Option<GpsData>,
}

#[derive(Debug, Serialize, Deserialize, Clone, Default)]
pub struct ExifData {
    pub make: Option<String>,
    pub model: Option<String>,
    pub lens_model: Option<String>,
    pub exposure_time: Option<String>,
    pub f_number: Option<String>,
    pub iso_speed: Option<String>,
    pub focal_length: Option<String>,
    pub date_time_original: Option<String>,
    pub flash: Option<String>,
    pub metering_mode: Option<String>,
    pub white_balance: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone, Default)]
pub struct GpsData {
    pub latitude: f64,
    pub longitude: f64,
    pub altitude: Option<f64>,
    pub map_url: String,
}

pub fn extract_metadata(path_str: &str) -> Result<ImageMetadata, String> {
    let path = Path::new(path_str);
    let file = File::open(path).map_err(|e| format!("Failed to open file: {}", e))?;
    let file_meta = file.metadata().map_err(|e| format!("Failed to read file metadata: {}", e))?;
    let file_size = file_meta.len();
    let file_name = path
        .file_name()
        .map(|s| s.to_string_lossy().to_string())
        .unwrap_or_else(|| "Unknown".to_string());

    let mut reader = BufReader::new(file);
    let exifreader = exif::Reader::new();
    let exif = exifreader.read_from_container(&mut reader).ok();

    let mut exif_data = ExifData::default();
    let mut gps_data: Option<GpsData> = None;

    if let Some(ref exif_obj) = exif {
        for f in exif_obj.fields() {
            let val = f.display_value().with_unit(exif_obj).to_string();
            match f.tag {
                exif::Tag::Make => exif_data.make = Some(val),
                exif::Tag::Model => exif_data.model = Some(val),
                exif::Tag::LensModel => exif_data.lens_model = Some(val),
                exif::Tag::ExposureTime => exif_data.exposure_time = Some(val),
                exif::Tag::FNumber => exif_data.f_number = Some(val),
                exif::Tag::PhotographicSensitivity => exif_data.iso_speed = Some(val),
                exif::Tag::FocalLength => exif_data.focal_length = Some(val),
                exif::Tag::DateTimeOriginal => exif_data.date_time_original = Some(val),
                exif::Tag::Flash => exif_data.flash = Some(val),
                exif::Tag::MeteringMode => exif_data.metering_mode = Some(val),
                exif::Tag::WhiteBalance => exif_data.white_balance = Some(val),
                _ => {}
            }
        }
    }

    let img_dim = image::image_dimensions(path).unwrap_or((0, 0));
    let format = path
        .extension()
        .map(|e| e.to_string_lossy().to_uppercase())
        .unwrap_or_else(|| "IMAGE".to_string());

    Ok(ImageMetadata {
        file_name,
        file_size_bytes: file_size,
        format,
        width: img_dim.0,
        height: img_dim.1,
        color_model: "RGB".to_string(),
        bit_depth: "8-bit per channel".to_string(),
        exif: Some(exif_data),
        gps: gps_data,
    })
}
