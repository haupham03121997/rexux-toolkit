import Blog from 'pages/Blog'
import NotFound from 'pages/NotFound'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
function App() {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<Blog />} />
                <Route path='*' element={<NotFound />}></Route>
            </Routes>
        </Router>
    )
}

export default App
