import React, {useState} from "react";
import {
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  SelectChangeEvent,
  Box,
  FormHelperText
} from "@mui/material";
import {useRecoilValue} from "recoil";
import {curUserInfoAtom} from "../atoms/UserInfoAtom";
import {useNavigate} from "react-router-dom";
import {ERROR} from "../constants";
import {createForumPost} from "../firebase/FirebaseFunctions";

interface IForumPostForm {
  title: string;
  content: string;
  category: string;
}

const categories = [
  "Alcohol",
  "Tobacco"
];

const ForumPostCreationForm = () => {
  const navigate = useNavigate();
  const curUserInfo = useRecoilValue(curUserInfoAtom);
  const [forumPost, setForumPost] = useState<IForumPostForm>({
    title: "",
    content: "",
    category: ""
  });

  const [titleWarning, setTitleWarning] = useState<string>("");
  const [contentWarning, setContentWarning] = useState<string>("");
  const [categoryWarning, setCategoryWarning] = useState<string>("");

  const clearWarnings = () => {
    setTitleWarning("");
    setContentWarning("");
    setCategoryWarning("");
  };

  const checkData = () => {
    let dataReady: boolean = true;
    if (!forumPost.title) {
      setTitleWarning("Please enter post title");
      dataReady = false;
    }
    if (!forumPost.content) {
      setContentWarning("Please enter the post content");
      dataReady = false;
    }
    if (!forumPost.category) {
      setCategoryWarning("Please select a category");
      dataReady = false;
    }
    return dataReady;
  };

  const handleSubmit = async () => {
    clearWarnings();
    if (!checkData()) {
      return;
    }
    const postBody = {
      user_id: curUserInfo.id,
      username: curUserInfo.username,
      is_alcohol_post: forumPost.category === "Alcohol",
      title: forumPost.title,
      content: forumPost.content
    };
    // Send ticket creation request
    const createForumPostResponse = (await createForumPost(postBody)).data;

    if (createForumPostResponse.error !== ERROR.NO_ERROR) {
      console.log(createForumPostResponse.error);
    } else {
      // Navigate to home page
      navigate("/forum");
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | { name?: string | undefined; value: unknown; }>) => {
    const {name, value} = event.target;
    setForumPost((prevState) => ({...prevState, [name as string]: value as string}));
  };

  const handleSelectChange = (event: SelectChangeEvent) => {
    setForumPost((prevState) => ({...prevState, category: event.target.value}));
  };

  return (
    <Box
      component="form"
      sx={{
        mt: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px",
        width: "80%",
        maxWidth: "600px",
        mx: "auto",
        p: "24px",
        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.25)",
        borderRadius: "8px",
        backgroundColor: "#f5f5f5",
      }}
    >
      <h2 style={{margin: 0}}>SHARE YOUR EXPERIENCE!</h2>
      <FormControl sx={{minWidth: "250px"}}>
        <TextField
          label="Title"
          name="title"
          value={forumPost.title}
          onChange={handleChange}
          required
          fullWidth
          variant="outlined"
          size="small"
          helperText={titleWarning}
          error={titleWarning !== ""}
        />
      </FormControl>
      <FormControl sx={{minWidth: "250px"}}>
        <TextField
          label="Content"
          name="content"
          value={forumPost.content}
          onChange={handleChange}
          required
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          size="small"
          helperText={contentWarning}
          error={contentWarning !== ""}
        />
      </FormControl>
      <FormControl sx={{m: 1, minWidth: "250px"}} required size="small" error={categoryWarning !== ""}>
        <InputLabel id="demo-select-small">Category</InputLabel>
        <Select
          labelId="demo-select-small"
          id="demo-select-small"
          value={forumPost.category}
          label="Category *"
          fullWidth
          onChange={handleSelectChange}
        >
          {categories.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>{categoryWarning}</FormHelperText>
      </FormControl>
      <Button
        variant="contained"
        size="medium"
        sx={{mt: "20px", width: "100px"}}
        onClick={handleSubmit}
      >
        Submit
      </Button>
    </Box>
  );
};

export default ForumPostCreationForm;