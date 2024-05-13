import React, {useEffect, useState} from "react";
import {useRecoilState} from "recoil";
import {curUserInfoAtom} from "../atoms/UserInfoAtom";
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import {ERROR, Post} from "../constants";
import {updateUserPostReaction} from "../firebase/FirebaseFunctions";
import {Button, Card, CardContent, CardHeader, Typography} from "@mui/material";

type PostItemProps = {
  post: Post
};

export const ForumPostItem: React.FC<PostItemProps> = ({post}) => {
  const [curUserInfo, setCurUserInfo] = useRecoilState(curUserInfoAtom);
  const [liked, setLiked] = useState<boolean>(false);
  const [postTime, ] = useState<Date>(new Date(post.post_time._seconds * 1000 + post.post_time._nanoseconds / 1000000));
  const [likedTimes, setLikedTimes] = useState<number>(post.liked);

  useEffect(() => {
    if (post.id) {
      setLiked(curUserInfo.liked_posts.includes(post.id));
    }
  }, [likedTimes]);

  const likedOnClick = async (isLike: boolean) => {
    const originalStatus = liked;
    setLiked(isLike);

    const originalLikedTimes = likedTimes;
    const original_liked_posts: string[] = curUserInfo.liked_posts.slice();

    let liked_posts: string[] = curUserInfo.liked_posts.slice();
    if (isLike && post.id) {
      // console.log(originalLikedTimes + 1);
      setLikedTimes(originalLikedTimes + 1);
      liked_posts.push(post.id);
    } else {
      const remove_index = curUserInfo.liked_posts.indexOf(post.id);
      setLikedTimes(originalLikedTimes - 1);
      liked_posts.splice(remove_index, 1);
    }
    setCurUserInfo((prev: any) => ({
      ...prev,
      liked_posts: liked_posts
    }));
    const request = {
      user_id: curUserInfo.id,
      post_id: post.id,
      is_like: isLike
    }
    const updateUserPostReactionResponse = (await updateUserPostReaction(request)).data;
    if (updateUserPostReactionResponse.error !== ERROR.NO_ERROR) {
      console.log(updateUserPostReactionResponse.error);
      setLiked(originalStatus);
      setLikedTimes(originalLikedTimes);
      setCurUserInfo((prev: any) => ({
        ...prev,
        liked_posts: original_liked_posts
      }));
    }
  };

  const cardStyle = {
    border: "1px ridge #0066cc",
    padding: "10px",
    backgroundColor: "#3f51b5",
    color: "#fff",
    maxWidth: "1500px", // set the maximum width of the card
    margin: "auto", // center the card horizontally
    marginBottom: "20px",
  };

  const contentStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };

  const buttonStyle = {
    marginLeft: "5px",
  };

  return (
    <Card style={cardStyle} variant="outlined">
      <CardHeader title={post.title} />
      <CardContent>
        <div style={contentStyle}>
          <div>
            <Typography>
              <strong>Created by:</strong> {post.username}
            </Typography>
            <Typography>{post.content}</Typography>
          </div>
          <div>
            <Typography>
              <strong>Created on:</strong> {postTime.toLocaleDateString()}
            </Typography>
            <Typography>
              {liked ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => likedOnClick(false)}
                  style={buttonStyle}
                >
                  <ThumbUpAltIcon />
                  <p>{likedTimes}</p>
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => likedOnClick(true)}
                  style={buttonStyle}
                >
                  <ThumbUpOffAltIcon />
                  <p>{likedTimes}</p>
                </Button>
              )}
            </Typography>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}