package main

import (
	"context"
	"errors"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"webui-ztnetools/internal/config"
	"webui-ztnetools/internal/handler"
	"webui-ztnetools/internal/middleware"
	"webui-ztnetools/internal/service"
)

func main() {
	cfg := config.LoadFromEnv()

	exitSvc := service.NewExitNodeService(cfg.ZTHost)
	exitHandler := handler.NewExitNodeHandler(exitSvc)

	mux := http.NewServeMux()
	mux.HandleFunc("/api/health", handler.Health)
	mux.HandleFunc("/api/exit-node/setup", exitHandler.Setup)

	handlerChain := middleware.Logger(middleware.Auth(cfg.BackendKey)(mux))

	srv := &http.Server{
		Addr:    ":" + cfg.BackendPort,
		Handler: handlerChain,
	}

	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	go func() {
		<-ctx.Done()
		shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()
		if err := srv.Shutdown(shutdownCtx); err != nil {
			log.Printf("shutdown error: %v", err)
		}
	}()

	log.Printf("server listening on %s", srv.Addr)
	if err := srv.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
		log.Fatal(err)
	}
}
