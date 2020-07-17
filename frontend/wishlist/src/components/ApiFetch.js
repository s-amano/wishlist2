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

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
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
      <Grid container spacing={1} xs={4}>
        <List component="nav" aria-label="">
        {
          wishlists.map(wish =>
          <ListItem className="" key={wish.id}>
            <ListItemText>
              <Grid container >
                <Grid item xs={6}>
                  <h2>{wish.title}</h2>
                </Grid>
                <Grid item xs={2}>
                  <Button variant="contained" color="secondary" onClick={()=>deleteWish(wish.id)}>
                    <i className="fas fa-trash-alt"></i>
                  </Button>
                </Grid>
                <Grid item xs={2}>
                  <Button variant="contained" color="primary" onClick={()=>setEditedWish(wish)}>
                    <i className="fas fa-pen"></i>
                  </Button>
                </Grid>
                <Grid item xs={2}>
                  <Button variant="contained" color="success" onClick={()=>getAmazonLink(wish.id)}>
                    Amazon Link
                  </Button>
                </Grid>
              </Grid>
            </ListItemText>
          </ListItem>)
        }
        </List>

      <Grid container spacing={1} >
        <input className="wishInput" type='text' name='title'
          value = {editedWish.title}
          onChange={handleInputChange()}
          placeholder="欲しいもの" required />
          { editedWish.id ?
        <Button className="btn btn-primary btn-lg" onClick={()=>editWish(editedWish)} >編集</Button> :
        <Button className="btn btn-success btn-lg" onClick={()=>newWish(editedWish)} >追加</Button> }
      </Grid>
       { amazonLink.link ?
        <a href={ amazonLink.link } >{ amazonLink.item }のAmazonリンク</a>:
        <></>
       }

    </Grid>
    </Grid>
  )
}

export default withCookies(ApiFetch)
