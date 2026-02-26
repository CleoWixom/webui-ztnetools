package middleware

import "net/http"

func Auth(requiredKey string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		if requiredKey == "" {
			return next
		}

		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			if r.Header.Get("X-ZTNET-KEY") != requiredKey {
				http.Error(w, "unauthorized", http.StatusUnauthorized)
				return
			}
			next.ServeHTTP(w, r)
		})
	}
}
