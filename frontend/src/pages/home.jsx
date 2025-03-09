import Card from "../components/card"
export default function Home(){
    return (
        <>
        <div className="bg-gray-200 min-h-screen py-8 px-4">
            <div className="max-w-xl mx-auto space-y-6">
                <Card 
                    user={{
                        initials: "JD",
                        avatarColor: "bg-green-600",
                        name: "Jane Doe",
                        title: "Product Manager at Tech Company",
                        timePosted: "2d",
                        score: 1836
                    }}
                    engagement={{
                        likeCount: 148,
                        commentCount: 42,
                        shareCount: 18
                    }}
                    prevScore={85}
                    finalScore={57}
                    darkMode={false}
                    onLikeClick={() => console.log("Liked")}
                    onCommentClick={() => console.log("Commented")}
                    onShareClick={() => console.log("Shared")}
                    onProfileClick={() => console.log("Profile clicked")}
                >
                </Card>

                <Card 
                    user={{
                        initials: "JD",
                        avatarColor: "bg-green-600",
                        name: "Jane Doe",
                        title: "Product Manager at Tech Company",
                        timePosted: "2d",
                        score: 1836
                    }}
                    engagement={{
                        likeCount: 148,
                        commentCount: 42,
                        shareCount: 18
                    }}
                    prevScore={85}
                    finalScore={97}
                    darkMode={false}
                    onLikeClick={() => console.log("Liked")}
                    onCommentClick={() => console.log("Commented")}
                    onShareClick={() => console.log("Shared")}
                    onProfileClick={() => console.log("Profile clicked")}
                >
                </Card>

                <Card 
                    user={{
                        initials: "JD",
                        avatarColor: "bg-green-600",
                        name: "Jane Doe",
                        title: "Product Manager at Tech Company",
                        timePosted: "2d",
                        score: 1836
                    }}
                    engagement={{
                        likeCount: 148,
                        commentCount: 42,
                        shareCount: 18
                    }}
                    prevScore={85}
                    finalScore={97}
                    darkMode={false}
                    onLikeClick={() => console.log("Liked")}
                    onCommentClick={() => console.log("Commented")}
                    onShareClick={() => console.log("Shared")}
                    onProfileClick={() => console.log("Profile clicked")}
                >
                </Card>

                <Card 
                    user={{
                        initials: "JD",
                        avatarColor: "bg-green-600",
                        name: "Jane Doe",
                        title: "Product Manager at Tech Company",
                        timePosted: "2d",
                        score: 1836
                    }}
                    engagement={{
                        likeCount: 148,
                        commentCount: 42,
                        shareCount: 18
                    }}
                    prevScore={85}
                    finalScore={97}
                    darkMode={false}
                    onLikeClick={() => console.log("Liked")}
                    onCommentClick={() => console.log("Commented")}
                    onShareClick={() => console.log("Shared")}
                    onProfileClick={() => console.log("Profile clicked")}
                >
                </Card>

                <Card 
                    user={{
                        initials: "JD",
                        avatarColor: "bg-green-600",
                        name: "Jane Doe",
                        title: "Product Manager at Tech Company",
                        timePosted: "2d",
                        score: 1836
                    }}
                    engagement={{
                        likeCount: 148,
                        commentCount: 42,
                        shareCount: 18
                    }}
                    prevScore={85}
                    finalScore={97}
                    darkMode={false}
                    onLikeClick={() => console.log("Liked")}
                    onCommentClick={() => console.log("Commented")}
                    onShareClick={() => console.log("Shared")}
                    onProfileClick={() => console.log("Profile clicked")}
                >
                </Card>
            </div>
        </div>
        </>
    )
}