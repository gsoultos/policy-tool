import React from 'react';
import './App.css';
import {Routes, Route} from "react-router-dom";
import Subject from "./pages/Subject";
import Resource from "./pages/Resource";
import Action from "./pages/Action";
import Environment from "./pages/Environment";
import Home from "./pages/Home";
import SideMenu from "./components/SideMenu";
import {CategoryApi, XACMLApi, ProjectApi, ABACApi} from "./api";
import ABAC from "./pages/ABAC";

export const CATEGORY_API = new CategoryApi(undefined, process.env.BACKEND_HOST)
export const ABAC_API = new ABACApi(undefined, process.env.BACKEND_HOST)
export const XACML_API = new XACMLApi(undefined, process.env.BACKEND_HOST)
export const PROJECT_API = new ProjectApi(undefined, process.env.BACKEND_HOST)

function App() {
    return (
        <div className="App">
            <SideMenu/>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="subject" element={<Subject/>}/>
                <Route path="resource" element={<Resource/>}/>
                <Route path="action" element={<Action/>}/>
                <Route path="environment" element={<Environment/>}/>
                <Route path="abac" element={<ABAC/>}/>
            </Routes>
        </div>
    );
}

export default App;
