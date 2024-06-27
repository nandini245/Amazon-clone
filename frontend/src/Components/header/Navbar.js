import React, { useContext, useState, useEffect } from 'react';
import "./navbar.css"
import SearchIcon from '@mui/icons-material/Search';
import Badge from '@mui/material/Badge';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Avatar from '@mui/material/Avatar';
import { NavLink, useNavigate } from 'react-router-dom';
import { LoginContext } from "../context/ContextProvider";
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import Rightheader from './Rightheader';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import LogoutIcon from '@mui/icons-material/Logout';
import {ToastContainer,toast} from 'react-toastify'
import { useSelector, useDispatch } from "react-redux";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';

const Navbar = () => {
    const { account, setAccount } = useContext(LoginContext);
    const [text, setText] = useState();
    const [liopen, setLiopen] = useState(true);
    const { products } = useSelector(state => state.getproductsdata);
    const history = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const [dropen, setDropen] = useState(false);
    
    const getdetailvaliduser = async () => {
        const res = await fetch("/validuser", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            credentials: "include"
        });

        const data = await res.json();
        if (res.status !== 201) {
            console.log("error");
        } else {
            console.log("data valid");
            setAccount(data);
        }
    };
    
    const handleopen = () => {
        setDropen(true);
    }

    const handledrclose = () => {
        setDropen(false);
    }
    
    useEffect(() => {
        getdetailvaliduser();
    }, [])

    const logoutuser = async () => {
        const res2 = await fetch("/logout", {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            credentials: "include"
        });

        const data2 = await res2.json();
        if (!res2.status === 201) {
            const error = new Error(res2.error);
            throw error;
        } else {
            setAccount(false);
            toast.success("user Logout 😃!", {
                position: "top-center"
            });
            history.push("/");
        }
    }

    const getText = (text) => {
        setText(text)
        setLiopen(false)
    }

    return (
        <header>
            <nav>
                <div className="left">
                    <IconButton className='hamburgur' onClick={handleopen}
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon style={{ color: "#fff" }} />
                    </IconButton>
                    <Drawer open={dropen} onClose={handledrclose}>
                        <Rightheader Logclose={handledrclose} logoutuser={logoutuser} />
                    </Drawer>
                    <div className="navlogo">
                        <img src="./amazon_PNG25.png" alt="logo"></img>
                    </div>
                    <div className="nav_searchbaar">
                        <input type="text" name=""
                            onChange={(e) => getText(e.target.value)}
                            placeholder="Search Your Products" />
                        <div className="search_icon">
                            <SearchIcon id="search" />
                        </div>
                        {
                            text &&
                            <List className="extrasearch" hidden={liopen}>
                                {
                                    products.filter(product => product.title.longTitle.toLowerCase().includes(text.toLowerCase())).map(product => (
                                        <ListItem key={product.id}>
                                            <NavLink to={`/getproductsone/${product.id}`} onClick={() => setLiopen(true)}>
                                                {product.title.longTitle}
                                            </NavLink>
                                        </ListItem>
                                    ))
                                }
                            </List>
                        }
                    </div>
                </div>
                <div className="right">
                    <div className='nav_btn'>
                        <NavLink to="/login">Signin</NavLink>
                    </div>
                    <div className='cart_btn'>
                        {
                            account ? <NavLink to="/buynow">
                                <Badge badgeContent={account.carts.length} color="primary">
                                    <ShoppingCartIcon id="icon" />
                                </Badge>
                            </NavLink> : <NavLink to="/login">
                                <Badge badgeContent={account.carts.length} color="primary">
                                    <ShoppingCartIcon id="icon" />
                                </Badge>
                            </NavLink>
                        }
                        <ToastContainer/>
                        <p>Cart</p>
                    </div>
                    {
                        account ? <Avatar className="avtar2"
                            id="basic-button"
                            aria-controls={open ? 'basic-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            onClick={handleClick}>{account.fname[0].toUpperCase()}</Avatar> :
                            <Avatar className="avtar" id="basic-button"
                                aria-controls={open ? 'basic-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                                onClick={handleClick}></Avatar>
                    }
                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={dropen}
                        onClose={handleClose}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}
                    >
                        <MenuItem onClick={handleClose} style={{ margin: 10 }}>My account</MenuItem>
                        {account ? (
                            <MenuItem onClick={() => { handleClose(); logoutuser(); }} style={{ margin: 10 }}>
                                <LogoutIcon style={{ fontSize: 16, marginRight: 3 }} /> Logout
                            </MenuItem>
                        ) : null}
                    </Menu>
                </div>
            </nav>
        </header>
    )
}

export default Navbar;
