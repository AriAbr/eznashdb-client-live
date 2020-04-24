import React, {Component} from 'react';
import { withLocalize } from "react-localize-redux";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from 'prop-types';
import { Typography, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Button } from '@material-ui/core';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SearchResultsTable from './SearchResultsTable';
import LoadingOverlay from 'react-loading-overlay';

const request = require("request");

const styles = theme => ({
  bigSearchButton: {
    marginLeft: '10px',
  },
  toggleButton: {
    height: '24px'
  },
  expansionPanelDetailsRoot: {
    display: 'flex',
    padding: '0px 24px 24px',
  },
  singleFilterParent: {
    marginRight: '10px'
  },
  filtersParent: {
    maxWidth: '100%',
    whiteSpace: 'normal',
    textAlign: 'left'
  }
});

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shuls: [],
      isLoadingResults: false,
      filterPanelIsOpen: false,
      filterData: {
        femLead: [],
        childcare: []
      }
    };
    this.searchByParams = this.searchByParams.bind(this);
  }

  toggleFilterPanel(){
    this.setState({
      filterPanelIsOpen: !this.state.filterPanelIsOpen
    })
  }

  getAllShuls(){
    this.setState({isLoadingResults: true}, () => {
      request.get(`${process.env.REACT_APP_EZNASHDB_API}shuls/getAll`, (err, res, body) => {
        if(res && res.statusCode === 200){
          var shuls = JSON.parse(res.body)
          this.setState({
            shuls: shuls,
            isLoadingResults: false
          })
        } else {
          this.setState({
            isLoadingResults: false,
          }, () => {
            window.alert("server error. see console for more info")
            console.log(res)
          })
        }
      });
    })
  }

  searchByParams(){
    this.setState({isLoadingResults: true}, () => {
      const options = {
        url: `${process.env.REACT_APP_EZNASHDB_API}shuls/searchByParams`,
        form: {
          femLead: this.state.filterData.femLead.join(" "),
          childcare: this.state.filterData.childcare.join(" "),
        }
      };
      request.post(options, (err, res, body) => {
        if(res && res.statusCode === 200){
          var shuls = JSON.parse(res.body)
          this.setState({
            shuls: shuls,
            isLoadingResults: false
          })
        } else {
          this.setState({
            isLoadingResults: false,
          }, () => {
            window.alert("server error. see console for more info")
            console.log(res)
          })
        }
      });
    })

  }

  updateFilterToggleData(e, val, fieldName){
    var newFilterData = this.state.filterData;
    newFilterData[fieldName] = val;
    this.setState({ filterData: newFilterData })
  }

  componentDidMount(){
    this.getAllShuls();
  }

  render() {
    const { classes } = this.props;

    const isHebrew = this.props.activeLanguage && this.props.activeLanguage.code === "he";

    const search = this.props.translate("search");
    const setFilters = this.props.translate("setFilters");
    const yes = this.props.translate("yes");
    const no = this.props.translate("no");
    const unknown = this.props.translate("unknown");
    const femaleLeadership = this.props.translate("femaleLeadership");
    const childcare = this.props.translate("childcare");

    const closedPanelOffset = isHebrew ? '94px' : '117px'
    
    return (
      <div>
        <Typography variant="h2" component="h2" gutterBottom className={classes.mainHeader}>
          {search}
        </Typography>
        <div className="search-parameters-parent">
          <ExpansionPanel
            style={{
              width: this.state.filterPanelIsOpen ? 'calc(100%)' : `calc(100% - ${closedPanelOffset})`,
              display: 'inline-block',
              transition: '.25s'
            }}
            expanded={this.state.filterPanelIsOpen}
            onChange={(e) => {this.toggleFilterPanel(e)}}
          >
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography className={classes.heading}><i className="fas fa-filter"></i>&nbsp;&nbsp;{setFilters}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails 
              classes={{
                root: classes.expansionPanelDetailsRoot
              }}
            >
              <div className={classes.filtersParent}>

                <span>


              <span className={classes.singleFilterParent + " search-single-filter-parent"}>
                <Typography display='inline' variant='subtitle2'>{femaleLeadership}:</Typography>&nbsp;
                <ToggleButtonGroup size="small" value={this.state.filterData.femLead} onChange={(e, val) => {this.updateFilterToggleData(e, val, 'femLead')}}>
                  <ToggleButton key={1} value={1} className={classes.toggleButton}>
                    {yes}
                  </ToggleButton>
                  <ToggleButton key={2} value={2} className={classes.toggleButton}>
                    {no}
                  </ToggleButton>
                  <ToggleButton key={3} value={0} className={classes.toggleButton}>
                    {unknown}
                  </ToggleButton>
                </ToggleButtonGroup>
              </span>

              <span className={classes.singleFilterParent + " search-single-filter-parent"}>
                <Typography display='inline' variant='subtitle2'>{childcare}:</Typography>&nbsp;
                <ToggleButtonGroup size="small" value={this.state.filterData.childcare} onChange={(e, val) => {this.updateFilterToggleData(e, val, 'childcare')}}>
                  <ToggleButton key={1} value={1} className={classes.toggleButton}>
                    {yes}
                  </ToggleButton>
                  <ToggleButton key={2} value={2} className={classes.toggleButton}>
                    {no}
                  </ToggleButton>
                  <ToggleButton key={3} value={0} className={classes.toggleButton}>
                    {unknown}
                  </ToggleButton>
                </ToggleButtonGroup>
              </span>
              </span>

                <Button onClick={this.searchByParams} variant="contained" color="primary" size="medium" style={{display: 'block', marginTop: '10px'}}><i className="fas fa-search"></i>&nbsp;{search}</Button>
              </div>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <Button variant="contained" color="primary"
            onClick={this.searchByParams}
            style={{
              verticalAlign: 'top',
              height: '48px',
            }}
            classes={{
              root: classes.bigSearchButton
            }}
          ><i className="fas fa-search"></i>&nbsp;{search}</Button>
        </div>


        <div className="search-results-container">
          <LoadingOverlay
            active={this.state.isLoadingResults}
            spinner
            text={null}
            style={{ }}
          >
            <SearchResultsTable 
              shuls={this.state.shuls}
              afterDelete={() => {this.getAllShuls()}}
              enableActions={true}
              isStickyHeader={true}
            />
          </LoadingOverlay>
        </div>
        
      </div>
    );
  }
}

Search.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withLocalize(Search));