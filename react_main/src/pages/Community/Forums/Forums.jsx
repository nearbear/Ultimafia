import React, {
  useReducer,
  useContext,
  useState,
  useRef,
  useLayoutEffect,
} from "react";
import { Link, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import update from "immutability-helper";

import Categories from "./Categories";
import Board from "./Board";
import Thread from "./Thread";
import SearchResults from "./SearchResults";
import ForumSearch from "./ForumSearch";
import { Time } from "components/Basic";
import { useErrorAlert } from "components/Alerts";
import { ForumContext, UserContext } from "Contexts";
import { NameWithAvatar } from "pages/User/User";

import "css/forums.css";
import {
  Box,
  Divider,
  IconButton,
  Link as MuiLink,
  Paper,
  Popover,
  Stack,
  Typography,
  Button,
  Breadcrumbs,
  Card,
  CardActionArea,
  Grid2,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { usePopoverOpen } from "hooks/usePopoverOpen";
import { useIsPhoneDevice } from "hooks/useIsPhoneDevice";

function ForumProvider({ children }) {
  const [forumNavInfo, updateForumNavInfo] = useForumNavInfo();

  return (
    <ForumContext.Provider value={{ forumNavInfo, updateForumNavInfo }}>
      {children}
    </ForumContext.Provider>
  );
}

export default function Forums() {
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);

  return (
    <ForumProvider>
      <Stack direction="column" spacing={1} className="forums">
        <ForumNav
          onSearchClick={() => setSearchDialogOpen(true)}
        />
        <Routes>
          <Route path="/" element={<Categories />} />
          <Route path="board/:boardId" element={<Board />} />
          <Route path="thread/:threadId" element={<Thread />} />
          <Route path="search" element={<SearchResults />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <ForumSearch
          open={searchDialogOpen}
          onClose={() => setSearchDialogOpen(false)}
        />
      </Stack>
    </ForumProvider>
  );
}

function ForumNav({ onSearchClick }) {
  const { forumNavInfo } = useContext(ForumContext);

  return (
    <Paper elevation={2} sx={{
      p: 1,
    }}>
      <Stack direction="row" spacing={1} sx={{
        alignItems: "center",
      }}>
        <Breadcrumbs separator={<i className="fas fa-chevron-right" />} aria-label="breadcrumb">
          <MuiLink component={Link} to="/community/forums">
            <i className="fas fa-home home" style={{
              marginRight: "calc(0.5*var(--mui-spacing))",
            }} />
            Forums
          </MuiLink>
          {forumNavInfo.board && (
            <MuiLink component={Link} to={`/community/forums/board/${forumNavInfo.board.id}`}>
              {forumNavInfo.board.name}
            </MuiLink>
          )}
          {forumNavInfo.thread && (
            <MuiLink component={Link} to={`/community/forums/thread/${forumNavInfo.thread.id}`}>
              {forumNavInfo.thread.title}
            </MuiLink>
          )}
        </Breadcrumbs>
        <div style={{ marginLeft: "auto" }}>
          <Button
            onClick={onSearchClick}
            startIcon="🔎"
            variant="outlined"
            size="small"
          >
            Search
          </Button>
        </div>
      </Stack>
    </Paper>
  );
}

function useForumNavInfo() {
  return useReducer((info, action) => {
    var newInfo;

    switch (action.type) {
      case "board":
        newInfo = {
          board: {
            id: action.id,
            name: action.name,
          },
        };
        break;
      case "thread":
        newInfo = {
          board: {
            id: action.boardId,
            name: action.boardName,
          },
          thread: {
            id: action.threadId,
            title: action.threadTitle,
          },
        };
        break;
      case "home":
        newInfo = {};
        break;
    }

    return newInfo || info;
  }, {});
}

export function ForumCard({
  to,
  actionContent,
  middleContent,
  recentReplies,
  className=undefined,
}) {
  const isPhoneDevice = useIsPhoneDevice();

  return (
    <Card className={className} sx={{
      overflow: "unset",
    }}>
      <Grid2 container sx={{
        width: "100%",
        height: "100%",
        alignItems: "stretch",
      }}>
        <Grid2 size={{ xs: 12, sm: 3 }}>
          <CardActionArea component={Link} variant="outlined" to={to}
            sx={{
              p: 1,
              width: "100%",
              height: "100%",
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "primary.main",
                opacity: "10%",
              }
            }}
          >
            {actionContent}
          </CardActionArea>
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 3 }}>
          {middleContent}
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6 }}>
          <ForumColumn title="Recent Replies" sx={{
            flex: isPhoneDevice ? undefined : "2 1 0%",
            minWidth: 0,
          }}>
            <Box sx={{
              display: "grid",
              gridTemplateColumns: isPhoneDevice ? "1fr" : `repeat(${recentReplies.length}, minmax(0, 1fr))`,
              height: "100%",
              gap: 1,
            }}>
              {recentReplies.length === 0 && (
                <Typography sx={{ textAlign: "center" }}>
                  No replies yet
                </Typography>
              )}
              {recentReplies}
            </Box>
          </ForumColumn>
        </Grid2>
      </Grid2>
    </Card>
  )
}

export function ForumColumn({ children, title = null, sx={} }) {
  return (
    <Stack direction="column" sx={{
      position: "relative",
      px: 1,
      pb: 1,
      pt: "calc(0.5*(var(--mui-spacing) + 1em) + var(--mui-spacing))",
      width: "100%",
      height: "100%",
      justifyContent: "center",
      ...sx,
    }}>
      <Stack direction="row" sx={{
        position: "absolute",
        top: "0px",
        left: "0px",
        width: "100%",
        justifyContent: "center",
        transform: "translateY(-50%)"
      }}>
        <Paper elevation={4} sx={{
          p: 0.5,
          "&::before": {
            position: "absolute",
            content: '""',
            top: "0px",
            left: "0px",
            background: ""
          }
        }}>
          <Typography variant="h4" sx={{
            lineHeight: "1",
          }}>
            {title}
          </Typography>
        </Paper>
      </Stack>
      {children}
    </Stack>
  );
}

export function ForumPost({ thread }) {
  const linkTo = thread.thread ?
    `/community/forums/thread/${thread.thread.id}?reply=${thread.id}` :
    `/community/forums/thread/${thread.id}`;

  return (
    <Paper elevation={4} sx={{
      alignSelf: "stretch",
      width: "100%",
      height: "100%",
      maxWidth: "15em",
    }}>
      <MuiLink variant="h5" component={Link} className="mui-popover-title" to={linkTo} sx={{
        display: "block",
        width: "100%",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      }}>
        {thread.title || thread.thread?.title}
      </MuiLink>
      <Stack direction="column" spacing={0.5} sx={{
        p: 0.5,
      }}>
        {thread.content && (<Typography variant="body2" sx={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          display: "-webkit-box",
          WebkitLineClamp: 1,
          WebkitBoxOrient: "vertical",
          opacity: "0.75",
        }}>
          {thread.content}
        </Typography>)}
        <NameWithAvatar
          id={thread.author.id}
          name={thread.author.name}
          avatar={thread.author.avatar}
          vanityUrl={thread.author.vanityUrl}
          subContent={
            <Typography variant="caption">
              <Time millisec={Date.now() - thread.postDate} suffix={" ago"} />
            </Typography>
          }
        />
        <Box sx={{
          alignSelf: "flex-end",
        }}>
          <ForumPostFooter thread={thread} />
        </Box>
      </Stack>
    </Paper>
  );
}

export function ForumPostFooter({ thread }) {
  if (thread.viewCount === undefined && thread.replyCount === undefined) {
    return <></>;
  }

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "min-content 1.5em min-content 1.5em",
      alignItems: "center",
      opacity: "0.75",
    }}>
      <Typography variant="body2" sx={{
        mr: 0.5,
        textAlign: "right",
      }}>
        {thread.viewCount || 0}
      </Typography>
      <i className="fas fa-eye" />
      <Typography variant="body2" sx={{
        mr: 0.5,
        textAlign: "right",
      }}>
        {thread.replyCount || 0}
      </Typography>
      <i className="fas fa-comments" />
    </div>
  );
}

export function VoteWidget(props) {
  const theme = useTheme();
  const item = props.item;
  const itemType = props.itemType;
  const itemHolder = props.itemHolder;
  const setItemHolder = props.setItemHolder;
  const itemKey = props.itemKey;

  const user = useContext(UserContext);
  const errorAlert = useErrorAlert();
  const [userVotes, setUserVotes] = useState([]);

  const upvoters = userVotes.slice().filter((vote) => vote.direction === 1);
  const downvoters = userVotes.slice().filter((vote) => vote.direction === -1);

  const { popoverOpen, openByClick, anchorEl, handleClick, closePopover } =
    usePopoverOpen();

  function updateItemVoteCount(direction, newDirection) {
    var voteCount = item.voteCount;

    if (item.vote === 0) voteCount += direction;
    else if (item.vote === direction) voteCount += -1 * direction;
    else voteCount += 2 * direction;

    return update(item, {
      vote: {
        $set: newDirection,
      },
      voteCount: {
        $set: voteCount,
      },
    });
  }

  function onVote(itemId, direction) {
    if (!user.perms.vote) return;

    axios
      .post("/api/forums/vote", {
        item: itemId,
        itemType,
        direction,
      })
      .then((res) => {
        var newDirection = Number(res.data);
        var newItem = updateItemVoteCount(direction, newDirection);
        var items;

        if (itemHolder == null) {
          setItemHolder(newItem);
          return;
        }

        if (itemKey) items = itemHolder[itemKey];
        else items = itemHolder;

        for (let i in items) {
          if (items[i].id === itemId) {
            var newItems = items.slice();
            newItems[i] = newItem;

            if (itemKey) {
              setItemHolder(
                update(itemHolder, {
                  [itemKey]: {
                    $set: newItems,
                  },
                })
              );
            } else setItemHolder(newItems);
            break;
          }
        }
      })
      .catch(errorAlert);
  }

  function getVotes(e, itemId) {
    if (!user.perms.viewVotes) return;
    handleClick(e);
    axios.get(`/api/forums/vote/${itemId}`).then((res) => {
      setUserVotes(res.data);
    });
  }

  return (
    <Stack direction="column">
      <IconButton
        className={`fas fa-arrow-up`}
        sx={{
          fontSize: "1em",
          ...(item.vote === 1 ? { color: theme.palette.info.main } : {}),
        }}
        onClick={() => onVote(item.id, 1)}
      />
      <IconButton
        onClick={(e) => getVotes(e, item.id)}
        sx={{
          position: "relative",
          fontSize: "1em",
          minWidth: "2em",
          minHeight: "2em",
        }}
      >
        <Typography
          sx={{
            position: "absolute",
            lineHeight: "1",
          }}
        >
          {item.voteCount || 0}
        </Typography>
      </IconButton>
      <IconButton
        className={`fas fa-arrow-down`}
        sx={{
          fontSize: "1em",
          ...(item.vote === -1 ? { color: theme.palette.info.main } : {}),
        }}
        onClick={() => onVote(item.id, -1)}
      />
      <Popover
        open={popoverOpen}
        sx={{ pointerEvents: openByClick ? "auto" : "none" }}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "center",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "center",
          horizontal: "left",
        }}
        onClose={closePopover}
        disableScrollLock
        disableRestoreFocus
      >
        <Stack
          direction="column"
          spacing={1}
          sx={{
            p: 1,
          }}
        >
          <i className="fas fa-arrow-up" style={{ alignSelf: "center" }} />
          {upvoters.map((e) => (
            <NameWithAvatar
              small
              id={e.voter.id}
              name={e.voter.name}
              vanityUrl={e.voter.vanityUrl}
              avatar={e.voter.avatar}
            />
          ))}
          {upvoters.length === 0 && (
            <Typography sx={{ alignSelf: "center" }}>None</Typography>
          )}
          <Divider orientation="horizontal" flexItem />
          {downvoters.map((e) => (
            <NameWithAvatar
              small
              id={e.voter.id}
              name={e.voter.name}
              vanityUrl={e.voter.vanityUrl}
              avatar={e.voter.avatar}
            />
          ))}
          {downvoters.length === 0 && (
            <Typography sx={{ alignSelf: "center" }}>None</Typography>
          )}
          <i className="fas fa-arrow-down" style={{ alignSelf: "center" }} />
        </Stack>
      </Popover>
    </Stack>
  );
}
