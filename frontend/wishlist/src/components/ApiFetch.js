import React, { useState, useEffect} from 'react'
import { withCookies } from 'react-cookie'
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios'
// export const ApiContext = createContext()
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  input: {
    marginTop: '5%',
  },
  li: {
    textAlign: 'center',
  }
}));

const ApiFetch = (props) => {
  const classes = useStyles();

  const token = props.cookies.get('current-token')
  // console.log(token)
  const [wishlists, setWish] = useState([])
  const [editedWish, setEditedWish] = useState({id:'', title:''})
  const [amazonLink, setAmazonLink] = useState({link:'', item:''})

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/v1/wishlist/', {
      headers: {
        'Authorization': `Token ${token}`
      }
    })
    .then(res => {setWish(res.data)})
  },[token])

  const handleInputChange = () => evt => {
    const value = evt.target.value;
    const name = evt.target.name;
    setEditedWish({...editedWish, [name]:value})
  }

  const newWish = (wish) => {

    const data = {
      title: wish.title
    }
    axios.post('http://127.0.0.1:8000/api/v1/wishlist/', data,{
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      }
    })
    .then(res => {setWish([...wishlists, res.data]); setEditedWish({id:'',title:''})})
  }




  const deleteWish = (id) => {
    axios.delete(`http://127.0.0.1:8000/api/v1/wishlist/${id}/`,{
      headers: {
        'Authorization': `Token ${token}`
      }
    })
    .then(res => {setWish(wishlists.filter(wish => wish.id !== id));})
  }

  const editWish = (wish) => {

    axios.put(`http://127.0.0.1:8000/api/v1/wishlist/${wish.id}/`, wish,{
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      }
    })
    .then(res => {setWish(wishlists.map(wish => (wish.id === editedWish.id ? res.data :wish)));
      setEditedWish({id:'',title:''})

    })
  }


  const getAmazonLink = (id) => {
    axios.get(`http://127.0.0.1:8000/api/v1/link/${id}/`)
    .then(res => {setAmazonLink({link:res.data.link,item:res.data.itemName})})
    .catch(error => {
      const {
        status,
        statusText
      } = error.response;
      console.log(`Error! HTTP Status: ${status} ${statusText}`);
    });
  }

  return (
    <Grid container alignItems="center" justify="center">
      <Grid container alignItems="center" justify="center">
        <List>
        {
          wishlists.map(wish =>
          <ListItem className="" key={wish.id} className={classes.li}>
            <ListItemText>
              <Grid container spacing={6}>
                <Grid item xs={6}>
                  <h2>{wish.title}</h2>
                </Grid>
                <Grid item xs={2}>
                  <Button size="large"  variant="contained" color="secondary" onClick={()=>deleteWish(wish.id)} >
                    <i className="fas fa-trash-alt"></i>
                  </Button>
                </Grid>
                <Grid item xs={2}>
                  <Button size="large" variant="contained" color="primary" onClick={()=>setEditedWish(wish)}>
                    <i className="fas fa-pen"></i>
                  </Button>
                </Grid>
                <Grid item xs={2}>
                  <Button size="large" variant="contained" onClick={()=>getAmazonLink(wish.id)}>
                    Link
                  </Button>
                </Grid>
              </Grid>
            </ListItemText>
          </ListItem>)
        }
        </List>
      </Grid>

      <Grid container className={classes.input} alignItems="center" justify="center" spacing={2}>
        <Grid item >
        <TextField id="outlined-basic" variant="outlined" type='text' name='title'
          value = {editedWish.title}
          onChange={handleInputChange()}
          placeholder="欲しいもの" required />
        </Grid>
        <Grid item >
          { editedWish.id ?
        <Button variant="outlined" color="secondary" onClick={()=>editWish(editedWish)} >編集</Button> :
        <Button variant="outlined" color="primary" onClick={()=>newWish(editedWish)} >追加</Button> }
       </Grid>
      </Grid>

       { amazonLink.link ?
        <Link className={classes.input} href={ amazonLink.link } >{ amazonLink.item }のAmazonリンク</Link>:
        <></>
       }
       </Grid>



  )
}

export default withCookies(ApiFetch)
