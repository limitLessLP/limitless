package main

import (
    "context"
    "encoding/json"
    "log"
    "net/http"
    "time"
    "github.com/gorilla/mux"
    "go.mongodb.org/mongo-driver/mongo"
    "go.mongodb.org/mongo-driver/mongo/options"
)

type Subscriber struct {
    FirstName string    `json:"firstName,omitempty"`
    LastName  string    `json:"lastName,omitempty"`
    Email     string    `json:"email,omitempty"`
    Phone     string    `json:"phone,omitempty"`
    CreatedAt time.Time `json:"createdAt,omitempty"`
}

func main() {
    // MongoDB connection
    serverAPI := options.ServerAPI(options.ServerAPIVersion1)
    opts := options.Client().ApplyURI("mongodb+srv://royluo05:LzvNzwNWBvt7gPo2@cluster0.vxdh7.mongodb.net/?retryWrites=true&w=majority").
        SetServerAPIOptions(serverAPI)

    client, err := mongo.Connect(context.Background(), opts)
    if err != nil {
        log.Fatal("MongoDB connection error:", err)
    }

    // Test the connection
    err = client.Ping(context.Background(), nil)
    if err != nil {
        log.Fatal("MongoDB ping failed:", err)
    }
    log.Println("Successfully connected to MongoDB")

    router := mux.NewRouter()

    // Enable CORS
    router.Use(func(next http.Handler) http.Handler {
        return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
            w.Header().Set("Access-Control-Allow-Origin", "*")
            w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
            w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, Authorization")
            if r.Method == "OPTIONS" {
                w.WriteHeader(http.StatusOK)
                return
            }
            next.ServeHTTP(w, r)
        })
    })

    // API endpoint for subscriber creation
    router.HandleFunc("/api/subscribers", func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("Content-Type", "application/json")

        var subscriber Subscriber
        if err := json.NewDecoder(r.Body).Decode(&subscriber); err != nil {
            log.Printf("Error decoding request: %v", err)
            w.WriteHeader(http.StatusBadRequest)
            json.NewEncoder(w).Encode(map[string]string{
                "error": "Invalid request format",
            })
            return
        }

        // Set creation timestamp
        subscriber.CreatedAt = time.Now()

        // Use the new database and collection names
        collection := client.Database("Subscribers").Collection("users")
        _, err := collection.InsertOne(context.Background(), subscriber)
        if err != nil {
            log.Printf("Database error: %v", err)
            w.WriteHeader(http.StatusInternalServerError)
            json.NewEncoder(w).Encode(map[string]string{
                "error": "Failed to save subscription",
            })
            return
        }

        log.Println("Successfully saved subscription")
        w.WriteHeader(http.StatusCreated)
        json.NewEncoder(w).Encode(map[string]string{
            "message": "Subscription successful",
        })
    }).Methods("POST", "OPTIONS")

    log.Fatal(http.ListenAndServe(":8080", router))
}