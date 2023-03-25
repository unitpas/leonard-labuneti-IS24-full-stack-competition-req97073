new Vue({
    el: "#app",
    data: {
        products: [],
        displayProducts: [],
        product: {
            productId: null,
            productName: "",
            productOwnerName: "",
            Developers: [],
            scrumMasterName: "",
            startDate: "",
            methodology: "",
        },
        formTitle: "Add a new Product",
        formButton: "Add Product",
        showForm: false,
        searchTerm: ''
    },
    mounted() {
        this.getProducts();
    },
    methods: {
        getProducts() {
            axios
                .get("/api/products")
                .then((response) => {
                    this.products = response.data;
                    this.displayProducts = this.products;
                })
                .catch((error) => {
                    console.log(error);
                    alert(error?.response?.data?.error || error.message || 'Cannot load data, unknown error');
                });
        },
        clearForm() {
            this.product = {
                productId: null,
                productName: "",
                productOwnerName: "",
                Developers: [],
                scrumMasterName: "",
                startDate: "",
                methodology: "",
            };
        },
        clearSearch() {
            this.displayProducts = this.products;
            this.searchTerm = '';
        },
        filterProducts() {
            if (this.searchTerm == '') {
                this.displayProducts = this.products;
            } else {
                this.displayProducts = this.products.filter(item => {
                    return item.productId.toString().toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                        item.productName.toString().toLowerCase().indexOf(this.searchTerm.toLowerCase()) >= 0 ||
                        item.productOwnerName.toString().toLowerCase().indexOf(this.searchTerm.toLowerCase()) >= 0 ||
                        item.scrumMasterName.toString().toLowerCase().indexOf(this.searchTerm.toLowerCase()) >= 0 ||
                        item.methodology.toString().toLowerCase().indexOf(this.searchTerm.toLowerCase()) >= 0 ||
                        item.startDate.toString().toLowerCase().indexOf(this.searchTerm.toLowerCase()) >= 0 ||
                        item.Developers.filter(str => str.toLowerCase().includes(this.searchTerm.toLowerCase())).length > 0
                })
            }
        },
        submitProduct() {
            if (this.formTitle === "Add a new Product") {
                //convert Developers to array if necessary
                if (!Array.isArray(this.product.Developers)) {
                    this.product.Developers = this.product.Developers.split(',');
                }

                //validate developers field
                if (this.product.Developers.length > 5) {
                    alert('Up to 5 developers allowed');
                    return;
                }

                axios
                    .post("/api/products", this.product)
                    .then((response) => {
                        this.products.push(response.data);
                        $("#formModal").modal('hide');
                        this.clearForm();
                        this.clearSearch();
                    })
                    .catch((error) => {
                        console.log(error);
                        alert(error?.response?.data?.error || error.message || 'Cannot insert data, unknown error')
                    });
            } else if (this.formTitle === "Edit product") {
                axios
                    .put(`/api/products/${this.product.productId}`, this.product)
                    .then((response) => {
                        const index = this.products.findIndex(
                            (p) => p.productId === response.data.productId
                        );
                        if (index !== -1) {
                            this.products.splice(index, 1, response.data);
                        }
                        $("#formModal").modal('hide');
                        this.clearSearch();
                    })
                    .catch((error) => {
                        console.log(error);
                        alert(error?.response?.data?.error || error.message || 'Cannot update data, unknown error');
                    });
            }
        },
        editProduct(product) {
            this.product = { ...product };
            this.formTitle = "Edit product";
            this.formButton = "Save changes";
            $("#formModal").modal('show');
        },
        deleteProduct(product) {
            if (confirm("Are you sure you want to delete this product?")) {
                axios
                    .delete(`/api/products/${product.productId}`)
                    .then(() => {
                        const index = this.products.findIndex(
                            (p) => p.productId === product.productId
                        );
                        if (index !== -1) {
                            this.products.splice(index, 1);
                        }
                        this.clearSearch();
                    })
                    .catch((error) => {
                        console.log(error);
                        alert(error?.response?.data?.error || error.message || 'Cannot delete data, unknown error');
                    });
            }
        }
    }
});
