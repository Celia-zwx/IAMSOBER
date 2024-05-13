import React, {useEffect, useState} from "react";
import {useRecoilState} from "recoil";
import {fetchForumPosts} from "../firebase/FirebaseFunctions";
import {ERROR, Post} from "../constants";
import {ForumPostItem} from "../components/ForumPostItem";
import {
  Button,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent
} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {alcoholTobaccoForumAtom} from "../atoms/AlcoholTobaccoForumAtom";

export function ForumPage() {
  const navigate = useNavigate();
  const [alcoholTobaccoForum, setAlcoholTobaccoForum] = useRecoilState(alcoholTobaccoForumAtom);
  const [sortMethod, setSortMethod] = useState<string>("Creation Time");
  const [forumPosts, setForumPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const fetchPostsRequest = {
        isAlcoholPost: alcoholTobaccoForum === "alcohol"
      };
      const fetchPostsResponse = (await fetchForumPosts(fetchPostsRequest)).data;
      if (fetchPostsResponse.error !== ERROR.NO_ERROR) {
        console.log(fetchPostsResponse.error);
      } else {
        let postList: Post[] = [];
        fetchPostsResponse.resp.forum_posts.map((p: Post) => postList.push(p));
        setForumPosts(postList);
      }
    };

    fetchPosts().catch(console.error);
  }, [alcoholTobaccoForum]);

  const handleChange = (event: SelectChangeEvent) => {
    setAlcoholTobaccoForum(event.target.value);
  };

  const sortMethodOnChange = (event: SelectChangeEvent) => {
    setSortMethod(event.target.value);
  };

  const compareTime = (a: Post, b: Post) => {
    return b.post_time._seconds - a.post_time._seconds;
  };

  const compareLiked = (a: Post, b: Post) => {
    if (a.liked === b.liked) {
      return b.post_time._seconds - a.post_time._seconds;
    }
    return b.liked - a.liked;
  }


  const renderForumPosts = () => {
    const compareFn = sortMethod === "Creation Time" ? compareTime : compareLiked;
    return forumPosts.sort(compareFn).map(post => <ForumPostItem key={post.id} post={post}/>)
  };

  const createOnClick = () => {
    navigate("/forum/create");
  };

  const buttonStyle = {
    flex: 0,
    minWidth: "200px", // set a minimum width for the Button component
  };

  const containerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    maxWidth: "1500px",
    margin: "0 auto",
    padding: "0 20px",
    marginTop: "50px",
    marginBottom: "30px"
  };

  const leftStyle = {
    display: "flex",
    flex: 1, // allow the content on the left to take up as much space as possible
    marginLeft: "auto"
  };

  return (
    <div>
      <div style={containerStyle}>
        <div style={leftStyle}>
          <FormControl>
            <RadioGroup
              row
              aria-labelledby="alcohol-tobacco-label"
              name="isAlcoholUser-button-group"
              defaultValue="alcohol"
              value={alcoholTobaccoForum}
              onChange={handleChange}
            >
              <FormControlLabel
                value="alcohol"
                control={<Radio color="warning" />}
                label="Alcohol"
                sx={{
                  '& .MuiSvgIcon-root': {
                    fontSize: 36,
                  },
                }}/>
              <FormControlLabel
                value="tobacco"
                control={<Radio color="warning" />}
                label="Tobacco"
                sx={{
                  '& .MuiSvgIcon-root': {
                    fontSize: 36,
                  },
                }}/>
            </RadioGroup>
          </FormControl>
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="forum-post-sorting">Sort By</InputLabel>
            <Select
              labelId="forum-post-sorting"
              id="forum-post-sorting"
              value={sortMethod}
              label="SortMethod"
              onChange={sortMethodOnChange}
            >
              <MenuItem value={"Creation Time"}>Creation Time</MenuItem>
              <MenuItem value={"Liked"}>Liked</MenuItem>
            </Select>
          </FormControl>
        </div>
        <Button style={buttonStyle} variant="contained" onClick={createOnClick}>SHARE YOUR EXPERIENCE</Button>
      </div>
      {renderForumPosts()}
    </div>
  )
}