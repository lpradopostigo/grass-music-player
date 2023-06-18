fn main() -> Result<(), Box<dyn std::error::Error>> {
    let profile = std::env::var("PROFILE")?;

    if profile == "debug" {
        copy_plugins()?;
    }

    Ok(())
}

fn copy_plugins() -> Result<(), Box<dyn std::error::Error>> {
    let plugins_dir = concat!(env!("CARGO_MANIFEST_DIR"), "/plugins");
    let plugins_dir = std::path::Path::new(plugins_dir);
    let debug_dir = concat!(env!("CARGO_MANIFEST_DIR"), "/target/debug");

    for entry in std::fs::read_dir(plugins_dir)? {
        let entry = entry?;
        let path = entry.path();
        let file_name = path.file_name().unwrap().to_str().unwrap();
        let debug_path = std::path::Path::new(debug_dir).join(file_name);

        if !debug_path.exists() {
            std::fs::copy(path, debug_path)?;
        }
    }

    Ok(())
}
