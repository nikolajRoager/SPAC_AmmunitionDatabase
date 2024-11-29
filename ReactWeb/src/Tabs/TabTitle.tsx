//See Tabs for an introduction to what this is
import React from "react"


type Props = {
  title: string
  index: number
  setSelectedTab: (index: number) => void
  selectedTab: number
}

//Use a button to represent the tab title we can click on
const TabTitle: React.FC<Props> = ({ title,index,selectedTab,setSelectedTab}) => {
//just a single table header with custom styling
  return (
    <th className={index==selectedTab?"tabheaderSelected":"tabheaderUnselected"}
    onClick={()=>{setSelectedTab(index)}}
    >{title}</th>
  )
}

export default TabTitle