import './App.css'
import Header from './header'
import AmmunitionList from '../Ammunition/AmmunitionList'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AmmunitionDetail from '../Ammunition/AmmunitionDetail'
import AmmunitionAdd from '../Ammunition/AmmunitionAdd'
import AmmunitionEdit from '../Ammunition/AmmunitionEdit'

function App() {

  return (
    //Show different pages depending on path
    <BrowserRouter>
    <div className='container'>
      <Header subtitle="Logistics Database"/>
      <Routes>
        <Route path="/" element={<AmmunitionList/>}></Route>
        <Route path="/AmmoBatch/:id" element={<AmmunitionDetail/>}></Route>
        <Route path="/AmmoBatch/add" element={<AmmunitionAdd/>}></Route>
        <Route path="/AmmoBatch/edit/:id" element={<AmmunitionEdit/>}></Route>
      </Routes>
    </div>
    </BrowserRouter>
  )
}

export default App
