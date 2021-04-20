import { useState } from "react";
import axios from "axios";

export default function AddNewsDialog({ closeModal }) {
  const [disable, setDisable] = useState(false);

  async function saveNews() {
    const title = window.newsTitle.value;
    const imageUrl = window.newsImageUrl.value;
    const writtenBy = window.newsWrittenBy.value;
    const body = window.newsBody.value;

    setDisable(true);
    await axios.post("http://localhost:1337/graphql", {
      query: `
      mutation {
        createNewsPost(input: { data: { title: "${title}", body: "${body}", imageUrl: "${imageUrl}", writtenBy: "${writtenBy}"}}) {
          newsPost {
            id
            title
            body
            writtenBy
            created_at
          }
        }
      }      
      `,
    });
    window.location.reload();
    setDisable(false);
  }

  return (
    <div className="modal">
      <div className="modal-backdrop" onClick={closeModal}></div>
      <div className="modal-content">
        <div className="modal-header">
          <h3>Add News</h3>
          <span
            style={{ padding: "10px", cursor: "pointer" }}
            onClick={closeModal}
          >
            X
          </span>
        </div>
        <div className="modal-body content">
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            <div className="inputField">
              <div className="label">
                <label>Title</label>
              </div>
              <div>
                <input id="newsTitle" type="text" />
              </div>
            </div>
            <div className="inputField">
              <div className="label">
                <label>ImageUrl</label>
              </div>
              <div>
                <input id="newsImageUrl" type="text" />
              </div>
            </div>
            <div className="inputField">
              <div className="label">
                <label>Written By</label>
              </div>
              <div>
                <input id="newsWrittenBy" type="text" />
              </div>
            </div>
            <div className="inputField" style={{ flex: "2 1 100%" }}>
              <div className="label">
                <label>Body</label>
              </div>
              <div>
                <textarea
                  id="newsBody"
                  style={{ width: "100%", height: "200px" }}
                ></textarea>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button
            disabled={disable}
            className="btn-danger"
            onClick={closeModal}
          >
            Cancel
          </button>
          <button disabled={disable} className="btn" onClick={saveNews}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
