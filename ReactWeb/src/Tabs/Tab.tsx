//See Tabs for an introduction to what this is
import React, { ReactElement } from 'react'


//This is largely inspired by this article https://medium.com/weekly-webtips/create-basic-tabs-component-react-typescript-231a2327f7b6

//The keyword "children" specifically picks up CONTENT from <Tab>CONTENT</Tab>
//Title won't be used by us, but <Tabs> will pick it up and hand it to the title
type Props = {
  children: ReactElement,
  title: string
}

//Pass through children as is, the only point in calling <Tab> is to make the code more readable
const Tab: React.FC<Props> = ({children}) => {
  return <div>{children}</div>
}

export default Tab