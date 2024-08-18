'use client';
import { 
    Box,  
    Card, 
    CardActionArea, 
    CardContent, 
    Container, 
    Grid,
    Typography 
} from '@mui/material';
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebase";
import { useSearchParams } from "next/navigation";

export default function Flashcard() {
    const {isLoaded, isSignedIn, user} = useUser();
    const [flashcards, setFlashcards] = useState([]);
    const [flipped, setFlipped] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const searchParams = useSearchParams();
    const search = searchParams.get('id');

    useEffect(() => {
        async function getFlashcard() {
            if (!search || !user) return;
            setLoading(true);
            try {
                // This path now matches your Firestore structure
                const flashcardSetRef = doc(db, "users", user.id, "flashcardSets", search);
                const flashcardsCollectionRef = collection(flashcardSetRef, "flashcards");
                
                console.log("Fetching flashcards for set:", search);
                
                const querySnapshot = await getDocs(flashcardsCollectionRef);
                
                const flashcards = [];
                querySnapshot.forEach((doc) => {
                    flashcards.push({ id: doc.id, ...doc.data() });
                });
                
                console.log("Fetched flashcards:", flashcards);
                
                setFlashcards(flashcards);
            } catch (err) {
                console.error("Error fetching flashcards:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        getFlashcard();
    }, [search, user]);

    // useEffect(() => {
    //     async function getFlashcard() {
    //         if (!search || !user) return;
    //         setLoading(true);
    //         try {
    //             const colRef = collection(doc(collection(db, "users"), user.id), search); 
    //             // const colRef = collection(db, "users", user.id, "flashcards", search);
    //             console.log("search: ", search); 
    //             console.log("colRef: ", colRef);
    //             const docs = await getDocs(colRef);
    //             console.log("docs: ", docs);
    //             const flashcards = [];
    //             docs.forEach((doc) => {
    //                 console.log("doc: ", doc);
    //                 flashcards.push({ id: doc.id, ...doc.data() });
    //             });
    //             setFlashcards(flashcards);
    //         } catch (err) {
    //             setError(err.message);
    //         } finally {
    //             setLoading(false);
    //         }
    //     }
    //     getFlashcard();
    // }, [search, user]);
    
    // // In your JSX:
    // if (!isLoaded || !isSignedIn) {
    //     return <Typography>Loading or not signed in...</Typography>;
    // }
    
    // if (loading) {
    //     return <Typography>Loading flashcards...</Typography>;
    // }
    
    // if (error) {
    //     return <Typography>Error: {error}</Typography>;
    // }
    
    // if (flashcards.length === 0) {
    //     return <Typography>No flashcards found.</Typography>;
    // }

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    if (!isLoaded || !isSignedIn) {
        return <></>
    }

    return (
        <Container maxWidth="md">
            <Grid 
                container 
                spacing={3} 
                sx={{mt: 4}}
            >
                {flashcards.map((flashcard) => (
                    <Grid item xs={12} sm={6} md={4} key={flashcard.id}>
                        <Card>
                            <CardActionArea onClick={() => handleCardClick(flashcard.id)}>
                                <CardContent>
                                    <Box sx={{ 
                                            perspective: '100px',
                                            '& > div': {
                                                transition: 'transform 0.6s',
                                                transformStyle: 'preserve-3d',
                                                position: 'relative',
                                                width: '100%',
                                                height: '200px',
                                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                                                transform: flipped[flashcard.id]
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
                                    }}>
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
    </Container>
   );
}