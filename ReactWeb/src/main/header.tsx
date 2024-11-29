import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.svg'

type Args = {
    subtitle: string
}

const Header = ({subtitle} : Args) =>{
    const nav = useNavigate();
    return (
        <header className='row mb-4' onClick={()=>nav("/")}>
            <div className='col-4'>
                <img
                    src={logo}
                    className='logo'
                    alt="Logo"
                />
            </div>
            <div className='col-7 mt-5 subtitle'>{subtitle}</div>
        </header>

    )
}

export default Header;