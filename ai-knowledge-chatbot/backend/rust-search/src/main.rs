use axum::{routing::get, Router};
use std::net::SocketAddr;

#[tokio::main]
async fn main() {
    let app = Router::new()
        .route("/health", get(health));

    let addr = SocketAddr::from(([0, 0, 0, 0], 8001));
    println!("Rust search service running on http://{}", addr);

    // NEW way in axum 0.7
    axum::serve(
        tokio::net::TcpListener::bind(addr).await.unwrap(),
        app
    )
    .await
    .unwrap();
}

async fn health() -> &'static str {
    "OK"
}
