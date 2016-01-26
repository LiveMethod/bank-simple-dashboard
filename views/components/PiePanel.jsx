// =========================================
// PiePanel
// ----
// Contains overal monthly expendature as a
// pie graph and numerical breakdown
// =========================================

import React from 'react';
import {Motion, spring} from 'react-motion';

/*

Scratch:

info needed for the pie panel:

spend (all debit transactions added)

saved (budget - spend)
saved %: saved/budget

possible saved (budet - necessary spend)
possible %: possible/budget

efficiency: saved/possible

*/

const PiePanel = React.createClass({
  render: function(){
    const txns = this.props.state.txns;
    const budget = this.props.state.monthlyBudget;

    let totalSpend = 0;
    // add every debit event to the monthly spend
    for(var i in txns){
      if(txns[i].bookkeeping_type == 'debit'){
        totalSpend += txns[i].amounts.amount/10000;
      }
    }

    // FIXME: when notes actually work, calculate this.
    // In the interim, it's fake
    let importantSpend = 2500;

    let savedCash = budget - totalSpend;
    let savedPct = savedCash/budget;

    let possibleSavedCash = budget - importantSpend;
    let possibleSavedPct = possibleSavedCash/budget;

    let efficiency = savedCash/possibleSavedCash;

    return (<ul>
      <PieStat 
        description="Saved"
        leftContent={'$'+savedCash}
        rightContent={savedPct+'%'}
      />
      <PieStat 
        description="Of A Possible"
        leftContent={'$'+possibleSavedCash}
        rightContent={possibleSavedPct+'%'}
      />
      <PieStat 
        description="Total"
        leftContent={'Efficiency'}
        rightContent={efficiency}
      />
    </ul>)
  }
});

// a ruled list item, displayed beside pie chart
const PieStat = React.createClass({
  render: function(){
    return(<li className="pie-stat">
      <p>{this.props.description}</p>
      <h2>{this.props.leftContent}</h2>
      <h2>{this.props.rightContent}</h2>
      <hr/>
    </li>)
  }
})


export default PiePanel;