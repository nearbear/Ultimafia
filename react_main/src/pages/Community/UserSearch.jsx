import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "../../Contexts";
import { useErrorAlert } from "../../components/Alerts";
import { NameWithAvatar, StatusIcon } from "../User/User";
import { getPageNavFilterArg, PageNav } from "../../components/Nav";
import { Time } from "../../components/Basic";
import {
  Box,
  Grid2,
  TextField,
  Card,
  CardContent,
  Typography,
  Paper,
  Stack,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useIsPhoneDevice } from "hooks/useIsPhoneDevice";

function UserCard({ user }) {
  return (
    <Paper variant="outlined" sx={{
      p: 1,
    }}>
      <Stack direction="row" spacing={1} alignItems="center">
        <Box sx={{
          flexGrow: 1,
          overflow: "hidden",
        }}>
          <NameWithAvatar
            id={user.id}
            name={user.name}
            avatar={user.avatar}
            vanityUrl={user.vanityUrl}
            subContent={
              <Typography variant="caption">
                {"last online "}
                <Time abbreviate minSec millisec={Date.now() - user.lastActive} suffix=" ago" />
              </Typography>
            }
          />
        </Box>
        <StatusIcon status={user.status} />
      </Stack>
    </Paper>
  );
}

export default function UserSearch(props) {
  const theme = useTheme();
  const [userList, setUserList] = useState([]);
  const [searchVal, setSearchVal] = useState("");

  const user = useContext(UserContext);
  const isPhoneDevice = useIsPhoneDevice();

  useEffect(() => {
    document.title = "Users | UltiMafia";
  }, []);

  useEffect(() => {
    if (searchVal.length > 0) {
      axios
        .get(`/api/user/searchName?query=${searchVal}`)
        .then((res) => {
          setUserList(res.data);
        })
        .catch(useErrorAlert);
    } else {
      axios
        .get("/api/user/online")
        .then((res) => {
          setUserList(res.data);
        })
        .catch(useErrorAlert);
    }
  }, [searchVal]);

  const users = [...userList, ...userList, ...userList, ...userList].map((user) => (
    <UserCard key={user.id} user={user} />
  ));

  return (
    <Grid2 container spacing={2}>
      <Grid2 size={{ xs: 12, md: 8 }}>
        <Paper sx={{
          p: 2,
        }}>
          <TextField
            fullWidth
            label="🔎 Username"
            variant="outlined"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
          <Box sx={{
            display: "grid",
            gridTemplateColumns: isPhoneDevice ? "1fr" : "repeat(3, minmax(0, 1fr))",
            gap: 2,
          }}>
            {users}
          </Box>
        </Paper>
      </Grid2>
      <Grid2 size={{ xs: 12, md: 4 }}>
        <Stack direction="column" spacing={2}>
          <NewestUsers />
          {user.perms.viewFlagged && <FlaggedUsers />}
        </Stack>
      </Grid2>
    </Grid2>
  );
}

function NewestUsers(props) {
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState([]);

  const errorAlert = useErrorAlert();

  useEffect(() => {
    onPageNav(1);
  }, []);

  function onPageNav(_page) {
    var filterArg = getPageNavFilterArg(
      _page,
      page,
      users,
      "joined",
      "lastActive"
    );

    if (filterArg == null) return;

    axios
      .get(`/api/user/newest?${filterArg}`)
      .then((res) => {
        if (res.data.length > 0) {
          setUsers(res.data);
          setPage(_page);
        }
      })
      .catch(errorAlert);
  }

  const userRows = users.map((user) => (
    <UserCard key={user.id} user={user} />
  ));

  return (
    <Paper sx={{
      p: 2,
    }}>
      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <Typography variant="h3" sx={{
          mr: "auto !important",
        }}>
          Newest Users
        </Typography>
        <PageNav page={page} onNav={onPageNav} inverted />
      </Stack>
      <Stack direction="column" spacing={1}>
        {userRows}
      </Stack>
    </Paper>
  );
}

function FlaggedUsers(props) {
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState([]);

  const errorAlert = useErrorAlert();

  useEffect(() => {
    onPageNav(1);
  }, []);

  function onPageNav(_page) {
    var filterArg = getPageNavFilterArg(_page, page, users, "joined");

    if (filterArg == null) return;

    axios
      .get(`/api/user/flagged?${filterArg}`)
      .then((res) => {
        if (res.data.length > 0) {
          setUsers(res.data);
          setPage(_page);
        }
      })
      .catch(errorAlert);
  }

  const userRows = users.map((user) => (
    <UserCard key={user.id} user={user} />
  ));

  return (
    <Paper sx={{
      p: 2,
    }}>
      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <Typography variant="h3" sx={{
          mr: "auto !important",
        }}>
          Flagged Users
        </Typography>
        <PageNav page={page} onNav={onPageNav} inverted />
      </Stack>
      {userRows}
    </Paper>
  );
}
