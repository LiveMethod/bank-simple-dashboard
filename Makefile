all: build

build: webpack

webpack:
	webpack

# scrub node modules and generated files
clean: 
	rm -rf ./public/js/*
	rm -rf ./node_modules