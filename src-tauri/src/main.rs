// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[derive(Clone, serde::Deserialize, Debug)]
struct KeydownDTO {
  key: String,
}

#[derive(serde::Deserialize, Debug)]
struct LogDTO {
    title: Option<String>,
    string: String,
    logLevel: Option<String>
}

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hellssso, {}! You've been greeted from Rust!", name)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet])
        .setup(|app| {
            let id = app.listen_global("keydown", |event: tauri::Event| {
                let deserialized: KeydownDTO = serde_json::from_str(event.payload().unwrap()).unwrap();
                println!("got event-name with payload2 {:?}", deserialized);
                
            });

            let logHandler = app.listen_global("console_log", |event: tauri::Event| {
                println!("{:?}", event.payload());
                let deserialized: LogDTO = serde_json::from_str(event.payload().unwrap()).unwrap();
                println!("❓ 로그 발생 {:#?}", deserialized);
            });
            // unlisten to the event using the `id` returned on the `listen_global` function
            // a `once_global` API is also exposed on the `App` struct

            // emit the `event-name` event to all webview windows on the frontend
            // app.emit_all("event-name", Payload { message: "Tauri is awesome!".into() }).unwrap();
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
