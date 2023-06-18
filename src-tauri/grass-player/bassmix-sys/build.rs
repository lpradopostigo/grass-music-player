use std::env::var;
use std::fs::copy;
use std::path::PathBuf;

fn main() {
    let lib_path = PathBuf::from("lib").canonicalize().unwrap();
    let out_dir = PathBuf::from(var("OUT_DIR").unwrap());

    copy(lib_path.join("bassmix.dll"), out_dir.join("bassmix.dll")).unwrap();
    copy(lib_path.join("bassmix.lib"), out_dir.join("bassmix.lib")).unwrap();

    println!("cargo:rustc-link-search=native={}", out_dir.display());
    println!("cargo:rustc-link-lib=dylib=bassmix");
}
