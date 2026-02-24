package db

import (
	"context"
	"fmt"
	"log"
	"time"

	"automation/config"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func NewMySQL(env string, conf *config.Database) *gorm.DB {
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=True", conf.Username, conf.Password, conf.Host, conf.Port, conf.DBName)
	// log.Printf("connecting to %s:[secret]@tcp(%s:%s)/%s?parseTime=True\n", conf.Username, conf.Host, conf.Port, conf.DBName)

	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Silent),
	})
	if err != nil {
		log.Fatalf("cannot connect to DB [%s], error: %v", conf.DBName, err)
	}

	sqlDB, err := db.DB()
	if err != nil {
		log.Fatalf("failed to get generic database object: %v", err)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := sqlDB.PingContext(ctx); err != nil {
		log.Fatalf("could not ping database: %v", err)
	}

	sqlDB.SetMaxOpenConns(conf.MaxOpenConns)
	sqlDB.SetMaxIdleConns(conf.MaxIdleConns)
	sqlDB.SetConnMaxLifetime(conf.MaxLifetime)

	return db
}
