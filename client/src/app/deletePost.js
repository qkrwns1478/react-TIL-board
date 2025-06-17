const deletePost = async (id, authorId) => {
    try {
        const response = await fetch(`/api/posts/${id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ author_id: authorId }),
        });

        if (response.status !== 200) {
            const error = await response.json();
            throw new Error(error.message || "삭제 실패");
        }

        return true;
    } catch (err) {
        console.error("게시글 삭제 오류:", err);
        throw err;
    }
};

export default deletePost;