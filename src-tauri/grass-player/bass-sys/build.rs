use std::env::var;
use std::fs::copy;
use std::path::PathBuf;

fn main() {
    let lib_path = PathBuf::from("lib").canonicalize().unwrap();
    let out_dir = PathBuf::from(var("OUT_DIR").unwrap());

    copy(lib_path.join("bass.dll"), out_dir.join("bass.dll")).unwrap();
    copy(lib_path.join("bass.lib"), out_dir.join("bass.lib")).unwrap();

    println!("cargo:rustc-link-search=native={}", out_dir.display());
    println!("cargo:rustc-link-lib=dylib=bass");
}
