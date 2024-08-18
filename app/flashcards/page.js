'use client'
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { 
    Card,
    CardActionArea,  
    CardContent,  
    Container, 
    Grid,
    Typography 
} from "@mui/material";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useRouter } from "next/navigation";

export default function Flashcard() {
    const {isLoaded, isSignedIn, user} = useUser();
    const [flashcards, setFlashcards] = useState([]);
    const router = useRouter();

    useEffect(() => {
        async function getFlashcards() {
                if (!user) return;
                console.log("user: ", user.id);
                const docRef = doc(collection(db, "users"), user.id); 
                console.log("docRef: ", docRef);
                const docSnap = await getDoc(docRef); // { source: "server" }
                // if (docSnap.exists()) console.log("Document data:", docSnap.flashcards());}
    
                if (docSnap.exists()) {
                    const collections = docSnap.data().flashcardSets || [];
                    setFlashcards(collections);
                    console.log("collections: ", collections)
                } else {
                    await setDoc(docRef, { flashcards: [] });
                }
            }
            getFlashcards();
        }, [user]);
    
    if (!isLoaded || !isSignedIn) {
        return <></>;
    }

    const handleCardClick = (id) => {
        router.push(`/flashcard?id=${id}`);
    }    

    return (
        <Container maxWidth="md">
            <Grid 
                container 
                spacing={3} 
                sx={{ mt: 4 }}
            >
            {flashcards.map((flashcard, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card>
                        <CardActionArea 
                            onClick={() => handleCardClick(flashcard.name)}
                        >
                            <CardContent>
                                <Typography variant="h5" component="div">
                                    {flashcard.name}
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>
            ))}
        </Grid>
     </Container>
    );
}
