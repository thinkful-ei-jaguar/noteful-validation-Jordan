import React from 'react'
import Note from '../Note/Note'
import './NotePageMain.css'
import StateContext from '../StateContext'
import {findNote} from '../notes-helpers'

export default class NotePageMain extends React.Component {
  static contextType = StateContext;
  // handleDeletePush = () => {
  //   this.props.history.push('/')
  // }

  render () {
    const {notes} = this.context
    console.log('notes from Context:', notes);
    
    const {noteId} = this.props.match.params;
    const note = findNote(notes, noteId);
    console.log('Note from findNote:', note);
  
  return (
    <section className='NotePageMain'>
      <Note
        id={note.id}
        name={note.name}
        modified={note.modified}
        {...this.props}
      />
      <div className='NotePageMain__content'>
        {note.content.split(/\n \r|\n/).map((para, i) =>
          <p key={i}>{para}</p>
        )}
      </div>
    </section>
  )
        }
}

