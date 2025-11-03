FROM node:20-slim AS base

COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.9.0 /lambda-adapter /opt/extensions/lambda-adapter

WORKDIR /app

RUN apt-get update && apt-get install -y git

# 依存関係をインストール
COPY package*.json ./
RUN npm ci

# アプリケーションコードをコピー
COPY tsconfig.json tsconfig.json
COPY src ./src

# サーバーが待ち受けるポート
ENV AWS_LWA_PORT=8080

# ts-nodeを使ってTypeScriptのまま起動
CMD ["node", "--loader", "ts-node/esm", "src/server.ts"]


# docker build -t mcp-node-lambda .
# docker run -d --rm -p 8080:8080 mcp-node-lambda