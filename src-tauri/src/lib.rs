pub mod image_ops;
pub mod metadata;

use image_ops::{
    adjust_color_bytes, convert_format_bytes, flip_image_bytes, resize_image_bytes,
    rotate_image_bytes, ColorAdjustParams, ResizeParams,
};
use metadata::{extract_metadata, ImageMetadata};
use tauri::command;

#[command]
fn get_file_metadata(path: String) -> Result<ImageMetadata, String> {
    extract_metadata(&path)
}

#[command]
fn rotate_image(bytes: Vec<u8>, degrees: i32) -> Result<Vec<u8>, String> {
    rotate_image_bytes(&bytes, degrees)
}

#[command]
fn flip_image(bytes: Vec<u8>, horizontal: bool) -> Result<Vec<u8>, String> {
    flip_image_bytes(&bytes, horizontal)
}

#[command]
fn resize_image(bytes: Vec<u8>, params: ResizeParams) -> Result<Vec<u8>, String> {
    resize_image_bytes(&bytes, params)
}

#[command]
fn adjust_color(bytes: Vec<u8>, params: ColorAdjustParams) -> Result<Vec<u8>, String> {
    adjust_color_bytes(&bytes, params)
}

#[command]
fn convert_format(
    bytes: Vec<u8>,
    target_format: String,
    quality: Option<u8>,
) -> Result<Vec<u8>, String> {
    convert_format_bytes(&bytes, &target_format, quality)
}

pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            get_file_metadata,
            rotate_image,
            flip_image,
            resize_image,
            adjust_color,
            convert_format
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
