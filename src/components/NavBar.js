import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import { withStyles } from "@material-ui/core/styles"
import PropTypes from 'prop-types';
import { AppBar, Toolbar, Typography, Button, IconButton, Drawer, ListItem, Divider } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import LanguageControls from './LanguageControls';
import { withLocalize } from "react-localize-redux";
import { Translate } from "react-localize-redux";


const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: theme.spacing(2),
  },
  navButton: {
    fontWeight: 500,
  },
  navButtonHeb: {
    fontSize: '16px',
    lineHeight: '24.5px',
  },
  drawerLink: {
    fontWeight: 500,
    textDecoration: 'none !important',
    color: '#757575',
    fontSize: '18px',
  },
  drawerLinkHeb: {
    fontSize: '20px',
    lineHeight: '22px',
  },
  title: {
    flexGrow: 1,
    whiteSpace: 'nowrap',
    width: 'calc(100% - 50px)',
    overflow: 'hidden',
    textAlign: 'left',
    textOverflow: 'ellipsis',
  },
  drawer: {
    width: '200px'
  }
});

class NavBar extends Component {
  constructor(props) {
      super(props);
      this.state = {
        drawerIsOpen: false,
      };
  }

  toggleDrawer(e, open){
    if (e.type === 'keydown' && (e.key === 'Tab' || e.key === 'Shift')) {
      return;
    }

    this.setState({ drawerIsOpen: open });
  }

  onDrawerSelection(){
    this.setState({
      drawerIsOpen: false,
    })
  }

  render() {
    const { classes } = this.props;
    const logIn = this.props.translate("logIn");
    const home = this.props.translate("home");
    const addShul = this.props.translate("addShul");

    var navButtonClassName = this.props.activeLanguage && this.props.activeLanguage.code === 'en' ? classes.navButton : classes.navButton + " " + classes.navButtonHeb;
    var drawerLinkClassName = this.props.activeLanguage && this.props.activeLanguage.code === 'en' ? classes.drawerLink : classes.drawerLink + " " + classes.drawerLinkHeb;

    return (
      <div className={classes.root}>
        <AppBar position="fixed">
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              <Translate id="appTitle" />
            </Typography>

            <div className="navbar-controls">
              <LanguageControls />

              <Link to={`/`} className="navbar-link">
                <Button color="inherit" className={navButtonClassName}>{home}</Button>
              </Link>

              <Link to={`/add-shul`} className="navbar-link">
                <Button color="inherit" className={navButtonClassName}>{addShul}</Button>
              </Link>

              <Link to={`/api`} className="navbar-link">
                <Button color="inherit" className={navButtonClassName}>API</Button>
              </Link>

              <Button color="inherit" className={navButtonClassName}>{logIn}</Button>
            </div>

            <IconButton edge="start" className={classes.menuButton + ' menu-button'} color="inherit" aria-label="menu"
              onClick={(e) => {this.toggleDrawer(e, true)}}
            >
              <MenuIcon />
            </IconButton>

          </Toolbar>
        </AppBar>

        <Drawer
          anchor='right'
          open={this.state.drawerIsOpen}
          variant='temporary'
          onClose={(e) => {this.toggleDrawer(e, false)}}
          classes={{
            paper: classes.drawer,
          }}
        >

          <Link to={`/`} className={drawerLinkClassName} onClick={() => {this.onDrawerSelection()}}>
            <ListItem button>
              {home.toUpperCase()}
            </ListItem>
          </Link>
          <Link to={`/add-shul`} className={drawerLinkClassName} onClick={() => {this.onDrawerSelection()}}>
            <ListItem button>
              {addShul.toUpperCase()}
            </ListItem>
          </Link>
          <Link to={`/api`} className={drawerLinkClassName} onClick={() => {this.onDrawerSelection()}}>
            <ListItem button>
              API
            </ListItem>
          </Link>
          <ListItem button className={drawerLinkClassName} onClick={() => {this.onDrawerSelection()}} style={{color: '#757575'}}>
            {logIn.toUpperCase()}
          </ListItem>
          <Divider />
          <ListItem style={{display: 'block'}}>
            <LanguageControls style={{margin: "auto", color: "black !important"}} parent='drawer' />
          </ListItem>

        </Drawer>

      </div>
    );
  }
}

NavBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withLocalize(NavBar));
