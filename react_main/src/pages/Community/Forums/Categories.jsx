import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import { NameWithAvatar } from "../../User/User";
import { Time } from "../../../components/Basic";
import { useErrorAlert } from "../../../components/Alerts";
import { ForumCard, ForumColumn, ForumPost } from "./Forums";
import { Loading } from "../../../components/Loading";
import {
  Divider,
  Link as MuiLink,
  Paper,
  Stack,
  Typography
} from "@mui/material";
import { ForumContext } from "Contexts";

export default function Categories(props) {
  const [categoryInfo, setCategoryInfo] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const { updateForumNavInfo } = React.useContext(ForumContext);
  const errorAlert = useErrorAlert();

  useEffect(() => {
    document.title = "Categories | UltiMafia";
    updateForumNavInfo({ type: "home" });

    axios
      .get("/api/forums/categories")
      .then((res) => {
        var categories = res.data.sort(sortItems);

        for (let category of categories)
          category.boards = category.boards.sort(sortItems);

        setCategoryInfo(categories);
        setLoaded(true);

        updateForumNavInfo({ type: "home" });
      })
      .catch(errorAlert);
  }, []);

  function sortItems(a, b) {
    return a.position - b.position;
  }

  const categories = categoryInfo.map((category) => {
    const boards = category.boards.map((board) => {
      const newestThreads = board.newestThreads.map((thread) => (
        <ForumPost thread={thread} key={thread.id} />
      ));

      const recentReplies = board.recentReplies.map((reply) => (
        <ForumPost thread={reply} key={reply.id} />
      ));

      return (
        <ForumCard className="board" to={`/community/forums/board/${board.id}`} key={board.id}
          actionContent={
            <Stack direction="row" spacing={1} sx={{
              height: "100%",
              alignItems: "center",
            }}>
              <i className={`fas fa-${board.icon || "comments"} board-icon`} />
              <Stack direction="column" sx={{
                height: "100%",
                justifyContent: "center",
              }}>

                <Typography variant="h3">
                  {board.name}
                </Typography>
                <Typography variant="caption">
                  {board.description}
                </Typography>
              </Stack>
            </Stack>
          }
          middleContent={
            <ForumColumn title="Newest Thread">
              {newestThreads.length === 0 && (
                <Typography sx={{ textAlign: "center" }}>
                  No threads yet
                </Typography>
              )}
              {newestThreads}
            </ForumColumn>
          }
          recentReplies={recentReplies}
        />
      );
    });

    return (
      <Paper elevation={2} className="forum-category" key={category.id} sx={{
        p: 2,
      }}>
        <Typography variant="h2" sx={{
          mb: 2,
          textAlign: "center",
        }}>
          {category.name}
        </Typography>
        <Stack direction="column" spacing={1} className="boards" divider={<Divider orientation="horizontal" flexItem />}>
          {boards}
        </Stack>
      </Paper>
    );
  });

  if (!loaded) return <Loading small />;

  return categories;
}
