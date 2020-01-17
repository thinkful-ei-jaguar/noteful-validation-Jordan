import React, {Component} from 'react';
import {Route, Link} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import NoteListNav from '../NoteListNav/NoteListNav';
import NotePageNav from '../NotePageNav/NotePageNav';
import NoteListMain from '../NoteListMain/NoteListMain';
import NotePageMain from '../NotePageMain/NotePageMain';
import AddFolder from '../AddFolder/AddFolder';
import AddNote from '../AddNote/AddNote';
import StateContext from '../StateContext';
import ErrorPage from '../ErrorPage';
import './App.css';

class App extends Component {
    state = {
        notes: [],
        folders: [],
        error: null
    };

    deleteNote = noteId => {
        const newNotes = this.state.notes.filter(note => note.id !== noteId)
        this.setState({
            notes: newNotes
        });
    }

    addFolder = (newFolder) => {
        this.setState({
            folders: [...this.state.folders, 
                newFolder
            ]
        })
      }

    addNote = (newNote) => {
        this.setState({
            notes: [...this.state.notes, 
                newNote
            ]
        })
    }

    componentDidMount() {
        //console log in here to see if this gets triggered after a refresh 
        fetch('http://localhost:9090/folders') 
            .then(res => {
                if(!res.ok) {
                    throw new Error(res.statusText);
                }
                return res.json()
        })
        .then(res => {
                // const folders = Object.keys(res)
                //     .map(key => res[key].item[0])
                this.setState({
                folders: res,
            })
        })
        .catch(err => this.setState({
            error: err.message
        }))

        fetch('http://localhost:9090/notes')
            .then(res => {
                if(!res.ok){
                    throw new Error(res.statusText);
                }
                return res.json();
            })
            .then(res => {
                this.setState({
                notes: res
            })
            console.log('Notes from fetch:', this.state.notes);
            })
            .catch(err => this.setState({
                error: err.message
            }))
    }

    renderNavRoutes() {
        return (
            <>
                {['/', '/folder/:folderId'].map(path => (
                    <Route
                        exact
                        key={path}
                        path={path}
                        component={NoteListNav}
                    />
                ))}
                <Route
                    path="/note/:noteId"
                    render={routeProps => {
                        return <NotePageNav {...routeProps}/>
                    }}
                />
                <Route path="/add-folder" component={AddFolder} />
                <Route path="/add-note" component={AddNote} />
            </>
        );
    }

    renderMainRoutes() {
        return (
            <>
                {['/', '/folder/:folderId'].map(path => (
                    <Route
                        exact
                        key={path}
                        path={path}
                        render={routeProps => {
                            return (
                                <NoteListMain
                                    {...routeProps} 
                                />
                            );
                        }}
                    />
                ))}
                <Route
                    path="/note/:noteId"
                    // component={NotePageMain}
                    render={routeProps => {
                        return <NotePageMain {...routeProps} />;
                    }}
                />
            </>
        );
    }

    render() {
        return (
            <ErrorPage>
                <StateContext.Provider value={{
                    folders: this.state.folders,
                    notes: this.state.notes,
                    deleteNote: this.deleteNote,
                    addFolder: this.addFolder,
                    addNote : this.addNote
                }}>
                    <div className="App">
                        <nav className="App__nav">
                            {this.renderNavRoutes()}
                        </nav>
                        <header className="App__header">
                            <h1>
                                <Link to="/">Noteful</Link>{' '}
                                <FontAwesomeIcon icon="check-double" />
                            </h1>
                        </header>
                        <main className="App__main">
                            {this.renderMainRoutes()}
                        </main>
                    </div>
                </StateContext.Provider>
            </ErrorPage>
        );
    }
}

export default App;
