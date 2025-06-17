import { useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const MarkdownEditor = ({ content, setContent }) => {
    const [activeTab, setActiveTab] = useState("write");
    const [tags, setTags] = useState("");
    const textareaRef = useRef();

    const insertMarkdown = (before, after) => {
        const textarea = textareaRef.current;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selected = content.slice(start, end);

        const newText =
            content.slice(0, start) +
            before +
            selected +
            after +
            content.slice(end);

        setContent(newText);

        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(
                start + before.length,
                end + before.length
            );
        }, 0);
    };

    const buttonStyle = {
        background: "white",
        border: "none",
        padding: "8px 12px",
        fontSize: "14px",
        cursor: "pointer",
    };

    const dividerStyle = {
        width: "1px",
        backgroundColor: "#999",
        height: "auto",
    };

    return (
        <div className="markdown-editor">
            <div
                style={{
                    width: "100%",
                    marginBottom: "0.5rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <div>
                    <button
                        onClick={() => setActiveTab("write")}
                        style={{
                            marginRight: "8px",
                            backgroundColor:
                                activeTab === "write" ? "#5094c4" : "#e0e0e0",
                            color: activeTab === "write" ? "#fff" : "#000",
                            border: "none",
                            padding: "6px 12px",
                            borderRadius: "4px",
                        }}
                    >
                        작성
                    </button>
                    <button
                        onClick={() => setActiveTab("preview")}
                        style={{
                            backgroundColor:
                                activeTab === "preview" ? "#5094c4" : "#e0e0e0",
                            color: activeTab === "preview" ? "#fff" : "#000",
                            border: "none",
                            padding: "6px 12px",
                            borderRadius: "4px",
                        }}
                    >
                        미리보기
                    </button>
                </div>
                {activeTab === "write" && (
                    <div
                        style={{
                            display: "inline-flex",
                            border: "1px solid #cccccc",
                            borderRadius: "1rem",
                            overflow: "hidden",
                        }}
                    >
                        <button
                            style={buttonStyle}
                            onClick={() => insertMarkdown("**", "**")}
                        >
                            굵게
                        </button>
                        <div style={dividerStyle} />
                        <button style={buttonStyle} onClick={() => insertMarkdown("*", "*")}>
                            기울임
                        </button>
                        <div style={dividerStyle} />
                        <button
                            style={buttonStyle}
                            onClick={() => insertMarkdown("```\n", "\n```")}
                        >
                            코드블럭
                        </button>
                        <div style={dividerStyle} />
                        <button
                            style={buttonStyle}
                            onClick={() => insertMarkdown("# ", "")}
                        >
                            제목
                        </button>
                        <div style={dividerStyle} />
                        <button
                            style={buttonStyle}
                            onClick={() => insertMarkdown("[텍스트]", "(링크)")}
                        >
                            링크
                        </button>
                    </div>
                )}
            </div>

            {activeTab === "write" ? (
                <textarea
                    ref={textareaRef}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="내용을 입력하세요"
                    style={{
                        width: "100%",
                        height: "480px",
                        padding: "12px",
                        resize: "none",
                    }}
                />
            ) : (
                <div
                    style={{
                        width: "100%",
                        height: "480px",
                        overflowY: "auto",
                        border: "1px solid #ccc",
                        padding: "12px",
                        background: "#f9f9f9",
                        textAlign: "left",
                        marginBottom: "8px",
                    }}
                >
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                            code({
                                node,
                                inline,
                                className,
                                children,
                                ...props
                            }) {
                                const match = /language-(\w+)/.exec(
                                    className || ""
                                );
                                return !inline && match ? (
                                    <SyntaxHighlighter
                                        style={oneDark}
                                        language={match[1]}
                                        PreTag="div"
                                        {...props}
                                    >
                                        {String(children).replace(/\n$/, "")}
                                    </SyntaxHighlighter>
                                ) : (
                                    <code className={className} {...props}>
                                        {children}
                                    </code>
                                );
                            },
                        }}
                    >
                        {content || "*내용을 입력하면 미리보기가 표시됩니다.*"}
                    </ReactMarkdown>
                </div>
            )}
        </div>
    );
};

export default MarkdownEditor;
