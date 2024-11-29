//This is initially inspired by https://medium.com/weekly-webtips/create-basic-tabs-component-react-typescript-231a2327f7b6
//However I have customized it quite extensively (The article does not work)

import React, { ReactElement, useState } from "react"
import TabTitle from "./TabTitle"

//The keyword "children" when used as a on a list pick up <Tabs><Tab>Content1</Tab><Tab>Content2</Tab>,...</Tabs> as  <Tab>Content1</Tab>,<Tab>Content2</Tab>,...
type Props = {
  children: ReactElement[]
  initialTab: number
}

const Tabs: React.FC<Props> = ({ children, initialTab=0 }) => {
    
  const [selectedTab, setSelectedTab] = useState(initialTab)

  return (
    <div>
      <table>
        <thead  className="tabbed">
        {children.map((item, index) => (
          <TabTitle key={index} title={item.props.title} index={index} setSelectedTab={setSelectedTab} selectedTab={selectedTab}/>
        ))}
        </thead>
      <tbody className="tabbed">
        <tr>
            <td colSpan={children.length} className="tabbed">
                { children[selectedTab]}
            </td>
        </tr>
      </tbody>
      </table>
    </div>
  )
}

export default Tabs