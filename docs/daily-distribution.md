# 每天推广只看这个

不要每天翻所有增长文档。每天只做一个动作：

```bash
python3 scripts/distribution_assistant.py --channel linkedin
```

然后打开：

```text
docs/today-post.md
```

里面会告诉你：

1. 打开哪个平台
2. 复制哪段内容
3. 发完以后做什么

发完后，把帖子链接直接发给 Codex。Codex 来帮你更新日志，不用你手动改 CSV。

## 今天推荐节奏

最小版：

- 发 1 条 LinkedIn 或 X

有余力版：

- 发 1 条 LinkedIn 或 X
- 提交 1 个 AI 工具目录

不要每天同时做 Reddit、Product Hunt、目录站、SEO。先把一个动作稳定做起来。

## 常用命令

生成 LinkedIn 帖：

```bash
python3 scripts/distribution_assistant.py --channel linkedin
```

生成 X 帖：

```bash
python3 scripts/distribution_assistant.py --channel x
```

生成 Reddit 帖：

```bash
python3 scripts/distribution_assistant.py --channel reddit
```

看可选帖子：

```bash
python3 scripts/distribution_assistant.py --channel linkedin --list
```

