import { useState, useMemo } from "react";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { EditorType } from "../../types/post";

function Editor(props: EditorType) {
  const { value, setValue } = props;
  const modules = useMemo(() => {
    return {
      toolbar: {
        container: [
          [{ size: ["small", false, "large", "huge"] }],
          [{ align: [] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          [
            {
              color: [],
            },
            { background: [] },
          ],
        ],
      },
    };
  }, []);

  return (
    <ReactQuill
      style={{ height: "400px", margin: "0 0 60px 0" }}
      placeholder="내용을 입력하세요."
      theme="snow"
      value={value}
      onChange={setValue}
      modules={modules}
    />
  );
}

export default Editor;