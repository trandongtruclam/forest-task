package main

import (
	"log"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	swaggerFiles "github.com/swaggo/files"
	"github.com/swaggo/gin-swagger"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	_ "forest-backend/docs"
)

// @title           Forest Facility Management API
// @version         1.0
// @description     API for managing forest campus facility bookings
// @host            localhost:8081
// @BasePath        /api

type Booking struct {
	ID           uint      `gorm:"primaryKey" json:"id"`
	FacilityName string    `json:"facilityName"`
	EmployeeName string    `json:"employeeName"`
	DateTime     time.Time `json:"dateTime"`
	Status       string    `json:"status"` // Confirmed, Pending, Completed, Cancelled
}

var db *gorm.DB

func initDB() {
	if err := godotenv.Load(); err != nil {
		log.Println("Warning: .env file not found, using system environment")
	}

	dsn := os.Getenv("DIRECT_URL")
	if dsn == "" {
		log.Fatal("DIRECT_URL environment variable is not set (Supabase connection string)")
	}

	var err error
	db, err = gorm.Open(postgres.New(postgres.Config{
		DSN:                  dsn,
		PreferSimpleProtocol: true,
	}), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to Supabase/PostgreSQL:", err)
	}

	if err := db.AutoMigrate(&Booking{}); err != nil {
		log.Fatal("Failed to migrate:", err)
	}

	// Seed data
	var count int64
	db.Model(&Booking{}).Count(&count)
	if count == 0 {
		bookings := []Booking{
			{FacilityName: "Birch Meditation Hut", EmployeeName: "Marcus Arvidson", DateTime: time.Now().AddDate(0, 0, 1).Round(time.Minute), Status: "Confirmed"},
			{FacilityName: "Crystal Spring Bath", EmployeeName: "Sarah Jenkins", DateTime: time.Now().AddDate(0, 0, 1).Add(150 * time.Minute), Status: "Pending"},
			{FacilityName: "Old Oak Forest Trail", EmployeeName: "Erik Nilsson", DateTime: time.Now().AddDate(0, 0, -1).Add(14 * time.Hour), Status: "Completed"},
			{FacilityName: "Zen Garden Deck", EmployeeName: "Lina Bergman", DateTime: time.Now().AddDate(0, 0, -1).Add(10 * time.Hour), Status: "Completed"},
			{FacilityName: "Silent Retreat Pod", EmployeeName: "Thomas Muller", DateTime: time.Now().AddDate(0, 0, -1).Add(8*time.Hour + 30*time.Minute), Status: "Cancelled"},
		}
		db.Create(&bookings)
		log.Println("Seeded mock bookings into Supabase")
	}
}

func main() {
	initDB()

	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000", "http://127.0.0.1:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	api := r.Group("/api")
	{
		api.GET("/bookings", getBookings)
		api.POST("/bookings", createBooking)
		api.GET("/bookings/:id", getBookingByID)
		api.PUT("/bookings/:id", updateBooking)
		api.DELETE("/bookings/:id", deleteBooking)
		api.GET("/stats", getStats)
		api.GET("/health", healthCheck)
	}

	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	log.Println("Server is running on http://localhost:8081")
	log.Println("Swagger UI: http://localhost:8081/swagger/index.html")
	r.Run(":8081")
}

// healthCheck godoc
// @Summary     Health check
// @Tags        health
// @Produce     json
// @Success     200  {object}  map[string]string
// @Router      /health [get]
func healthCheck(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"status": "ok"})
}

type statsResponse struct {
	TotalBookings    int64 `json:"totalBookings"`
	ActiveFacilities int64 `json:"activeFacilities"`
	RegisteredUsers  int64 `json:"registeredUsers"`
	PendingRequests  int64 `json:"pendingRequests"`
}

// getStats godoc
// @Summary     Dashboard statistics
// @Tags        stats
// @Produce     json
// @Success     200  {object}  statsResponse
// @Router      /stats [get]
func getStats(c *gin.Context) {
	var s statsResponse
	db.Model(&Booking{}).Count(&s.TotalBookings)
	db.Model(&Booking{}).Where("status = ?", "Pending").Count(&s.PendingRequests)
	db.Model(&Booking{}).Distinct("facility_name").Count(&s.ActiveFacilities)
	db.Model(&Booking{}).Distinct("employee_name").Count(&s.RegisteredUsers)
	c.JSON(http.StatusOK, s)
}

// getBookings godoc
// @Summary     List all bookings
// @Tags        bookings
// @Produce     json
// @Success     200  {array}   main.Booking
// @Failure     500  {object}  map[string]string
// @Router      /bookings [get]
func getBookings(c *gin.Context) {
	var bookings []Booking
	if err := db.Order("date_time desc").Find(&bookings).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch bookings"})
		return
	}
	c.JSON(http.StatusOK, bookings)
}

// getBookingByID godoc
// @Summary     Get booking by ID
// @Tags        bookings
// @Param       id   path      int  true  "Booking ID"
// @Produce     json
// @Success     200  {object}  main.Booking
// @Failure     400  {object}  map[string]string
// @Failure     404  {object}  map[string]string
// @Router      /bookings/{id} [get]
func getBookingByID(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid booking ID"})
		return
	}

	var b Booking
	if err := db.First(&b, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Booking not found"})
		return
	}
	c.JSON(http.StatusOK, b)
}

type createBookingInput struct {
	FacilityName string `json:"facilityName" binding:"required"`
	EmployeeName string `json:"employeeName" binding:"required"`
	DateTime     string `json:"dateTime" binding:"required"`
	Status       string `json:"status"`
}

// createBooking godoc
// @Summary     Create a new booking
// @Tags        bookings
// @Accept      json
// @Produce     json
// @Param       body  body      createBookingInput  true  "Booking data"
// @Success     201   {object}  main.Booking
// @Failure     400   {object}  map[string]string
// @Failure     500   {object}  map[string]string
// @Router      /bookings [post]
func createBooking(c *gin.Context) {
	var input createBookingInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	dt, err := time.Parse(time.RFC3339, input.DateTime)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid dateTime format (use RFC3339)"})
		return
	}

	status := input.Status
	if status == "" {
		status = "Pending"
	}

	b := Booking{
		FacilityName: input.FacilityName,
		EmployeeName: input.EmployeeName,
		DateTime:     dt,
		Status:       status,
	}
	if err := db.Create(&b).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create booking"})
		return
	}
	c.JSON(http.StatusCreated, b)
}

type updateBookingInput struct {
	FacilityName *string `json:"facilityName"`
	EmployeeName *string `json:"employeeName"`
	DateTime     *string `json:"dateTime"`
	Status       *string `json:"status"`
}

// updateBooking godoc
// @Summary     Update a booking
// @Tags        bookings
// @Param       id    path      int  true  "Booking ID"
// @Accept      json
// @Produce     json
// @Param       body  body      updateBookingInput  true  "Fields to update"
// @Success     200   {object}  main.Booking
// @Failure     400   {object}  map[string]string
// @Failure     404   {object}  map[string]string
// @Failure     500   {object}  map[string]string
// @Router      /bookings/{id} [put]
func updateBooking(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid booking ID"})
		return
	}

	var input updateBookingInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var b Booking
	if err := db.First(&b, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Booking not found"})
		return
	}

	if input.FacilityName != nil {
		b.FacilityName = *input.FacilityName
	}
	if input.EmployeeName != nil {
		b.EmployeeName = *input.EmployeeName
	}
	if input.DateTime != nil {
		dt, err := time.Parse(time.RFC3339, *input.DateTime)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid dateTime format"})
			return
		}
		b.DateTime = dt
	}
	if input.Status != nil {
		b.Status = *input.Status
	}

	if err := db.Save(&b).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update booking"})
		return
	}
	c.JSON(http.StatusOK, b)
}

// deleteBooking godoc
// @Summary     Delete a booking
// @Tags        bookings
// @Param       id   path      int  true  "Booking ID"
// @Produce     json
// @Success     200  {object}  map[string]string
// @Failure     400  {object}  map[string]string
// @Failure     404  {object}  map[string]string
// @Failure     500  {object}  map[string]string
// @Router      /bookings/{id} [delete]
func deleteBooking(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid booking ID"})
		return
	}

	result := db.Delete(&Booking{}, id)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete booking"})
		return
	}
	if result.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Booking not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Booking deleted"})
}
