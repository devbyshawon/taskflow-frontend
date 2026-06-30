import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import ProjectPage from './pages/ProjectPage';

const App = () => {
    return (
    <>
        <Navbar/>
        <Routes>
            <Route path = '/login' element = {<LoginPage/>}/>
            <Route path = '/signup' element = {<SignupPage/>}/>

            <Route element={<ProtectedRoute />}>
                <Route path = '/dashboard' element = {<DashboardPage/>}/>
                <Route path = '/project/:id' element = {<ProjectPage/>}/>
            </Route>
        
            <Route path = '*' element = {<Navigate to = '/login'/>}/>
        </Routes>        
    </>    
    
    );
};

export default App;
