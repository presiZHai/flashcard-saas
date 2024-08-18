'use client';

import { 
    Box, 
    Button, 
    Card, 
    CardActionArea, 
    CardContent, 
    Container, 
    Dialog, 
    DialogActions, 
    DialogContent, 
    DialogContentText, 
    DialogTitle,
    Grid, 
    Paper, 
    TextField, 
    Typography 
} from '@mui/material';
import { useUser } from '@clerk/nextjs';
import { collection, doc, getDoc, setDoc, writeBatch } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { db } from '@/firebase'; 

export default function Generate() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [flashcards, setFlashcards] = useState([]);
    const [flipped, setFlipped] = useState({});
    const [text, setText] = useState('');
    const [setName, setSetName] = useState('')
    const [dialogOpen, setDialogOpen] = useState(false)
    const [open, setOpen] = useState(false);
    const router = useRouter();

    const handleSubmit = async () => {
        if (!text.trim()) {
          alert('Please enter some text to generate flashcards.')
          return
        }
      
        try {
          const response = await fetch('/api/generate', {
            method: 'POST',
            body: text,
          })
      
          if (!response.ok) {
            throw new Error('Failed to generate flashcards')
          }
      
          const data = await response.json()
          setFlashcards(data)
        } catch (error) {
          console.error('Error generating flashcards:', error)
          alert('An error occurred while generating flashcards. Please try again.')
        }
      } 
    
    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    //const handleOpen = () => {setOpen(true);};
    //const handleClose = () => {setOpen(false);};
    const handleOpenDialog = () => setDialogOpen(true)
    const handleCloseDialog = () => setDialogOpen(false)

    const saveFlashcards = async () => {
        if (!setName.trim()) {
          alert('Please enter a name for your flashcard set.')
          return
        }
      
        try {
            console.log("user: ", user);
          const userDocRef = doc(collection(db, 'users'), user.id)
          const userDocSnap = await getDoc(userDocRef)
      
          const batch = writeBatch(db)
      
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data()
            const updatedSets = [...(userData.flashcardSets || []), { name: setName }]
            batch.update(userDocRef, { flashcardSets: updatedSets })
          } else {
            batch.set(userDocRef, { flashcardSets: [{ name: setName }] })
          }
      
          const setDocRef = doc(collection(userDocRef, 'flashcardSets'), setName)
          batch.set(setDocRef, { flashcards })
      
          await batch.commit()
      
          alert('Flashcards saved successfully!')
          handleCloseDialog()
          setSetName('')
        } catch (error) {
          console.error('Error saving flashcards:', error)
          alert('An error occurred while saving flashcards. Please try again.')
        }
      }
    return <Container maxWidth="md">
        <Box 
        sx={{
            mt: 4, 
            mb: 6,
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center'
        }}
        >
            <Typography variant="h4">Generate Flashcards</Typography>
            <Paper sx={{p: 4, width: '100%'}}>
                <TextField
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    label="Enter text to generate flashcards"
                    placeholder="Enter text to generate flashcards"
                    fullWidth
                    multiline
                    rows={4}
                    variant="outlined"
                    sx={{
                        mb: 2
                    }}
                />
                <Button 
                 variant="contained" 
                 color="primary" 
                 onClick={handleSubmit}
                 fullWidth
                >
                  Generate Flashcards
                </Button>
            </Paper>
        </Box>

        {flashcards.length > 0 && (
            <Box sx={{ mt: 4 }}>
                <Typography variant="h5">Flashcards Preview</Typography>
                <Grid container spacing={3}>
                    {flashcards.map((flashcard, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card>
                                <CardActionArea
                                    onClick={() => {
                                        handleCardClick(index);
                                    }}
                                >
                                    <CardContent>
                                        <Box
                                            sx={{
                                                perspective: '100px',
                                                '& > div': {
                                                    transition: 'transform 0.6s',
                                                    transformStyle: 'preserve-3d',
                                                    position: 'relative',
                                                    width: '100%',
                                                    height: '200px',
                                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                                                    transform: flipped[index]
                                                        ? 'rotateY(180deg)'
                                                        : 'rotateY(0deg)',
                                                },
                                                '& > div > div:nth-of-type(1)': {
                                                    position: 'absolute',
                                                    width: '100%',
                                                    height: '100%',
                                                    backfaceVisibility: 'hidden',
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    padding: 2,
                                                    boxSizing: 'border-box',
                                                },
                                                '& > div > div:nth-of-type(2)': {
                                                    transform: 'rotateY(180deg)',
                                                    position: 'absolute',
                                                    width: '100%',
                                                    height: '100%',
                                                    backfaceVisibility: 'hidden',
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    padding: 2,
                                                    boxSizing: 'border-box',
                                                },
                                            }}
                                        >
                                            <div>
                                                <div>
                                                    <Typography variant="h5" component="div">
                                                        {flashcard.front}
                                                    </Typography>
                                                </div>
                                                <div>
                                                    <Typography variant="h5" component="div">
                                                        {flashcard.back}
                                                    </Typography>
                                                </div>
                                            </div>
                                        </Box>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
                <Box sx={{ mt: 4, mb: 2, display: 'flex', justifyContent: 'center' }}>
                    <Button variant="contained" color="secondary" onClick={handleOpenDialog}>
                        Save
                    </Button>
                </Box>
            </Box>
        )}
        <Dialog open={dialogOpen} onClose={handleOpenDialog} maxWidth="md" fullWidth>
            <DialogTitle>Save Flashcard Set</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Please enter a name for your flashcards collection.
                </DialogContentText>
                <TextField
                    autoFocus
                    value={setName}
                    margin="dense"
                    onChange={(e) => setSetName(e.target.value)}
                    label="Flashcards Collection Name"
                    fullWidth
                    variant="outlined"
                    sx={{ mb: 2 }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseDialog} color="primary">
                    Cancel
                </Button>
                <Button onClick={saveFlashcards} color="primary" variant="contained">
                    Save
                </Button>
            </DialogActions>
        </Dialog>

    </Container>
}