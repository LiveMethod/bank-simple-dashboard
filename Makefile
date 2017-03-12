all: build

build: webpack styles

styles:
	lessc ./views/styles/main.less ./public/css/orchid.css

webpack:
	webpack

# scrub node modules and generated files
clean: 
	rm -rf ./public/js/*
	rm -rf ./public/css/*
	rm -rf ./node_modules