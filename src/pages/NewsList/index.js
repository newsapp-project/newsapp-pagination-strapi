import "./NewsList.css";
import NewsCard from "./../../components/NewsCard";
import { useEffect, useState } from "react";
import axios from "axios";
import AddNewsDialog from "../../components/AddNewsDialog";

export default function NewsList() {
  const [newsList, setNewsList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [start, setStart] = useState(0);
  const [limit] = useState(2);
  const [pageDetails, setPageDetails] = useState();

  useEffect(() => {
    async function fetchNews() {
      const data = await axios.post("http://localhost:1337/graphql", {
        query: `query {
        newsPostsConnection(limit: ${limit}, start: ${start}) {
          values {
            id
            title
            body
            writtenBy
            imageUrl
            created_at
          }
          aggregate {
            totalCount
          }
        }
      }`,
      });
      setPageDetails(data?.data?.data?.newsPostsConnection?.aggregate);
      setNewsList([...data?.data?.data?.newsPostsConnection?.values]);
      //window.location.reload();
    }
    fetchNews();
  }, [start]);

  function nextPage() {
    setStart(limit + start);
  }

  function prevPage() {
    setStart(start - limit);
  }

  function showAddNewsDialog() {
    setShowModal(!showModal);
  }

  return (
    <div className="newslist">
      <div className="newslistbreadcrumb">
        <div className="newslisttitle">
          <h3>World News</h3>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ marginRight: "4px" }}>
            <button onClick={showAddNewsDialog}>Add News</button>
          </div>
        </div>
      </div>
      <div>
        {newsList
          ?.sort((a, b) => b.created_at.localeCompare(a.created_at))
          ?.map((newsItem, i) => (
            <NewsCard newsItem={newsItem} key={i} />
          ))}
      </div>
      {showModal ? <AddNewsDialog closeModal={showAddNewsDialog} /> : null}
      <div>
        <span>
          <button disabled={limit > start} onClick={prevPage}>
            Prev
          </button>
        </span>
        <span>
          <button
            disabled={pageDetails && start + limit >= pageDetails?.totalCount}
            onClick={nextPage}
          >
            Next
          </button>
        </span>
      </div>
    </div>
  );
}
