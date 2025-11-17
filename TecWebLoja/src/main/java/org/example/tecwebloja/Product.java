package org.example.tecwebloja;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Product {

    //id, nome, categoria, preco, quantidade, fornecedor, codigoBarras

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String name;
    private String category;
    private float price;
    private Integer quantity;
    private String supplier;
    private String barcode;

    public Integer getId() {return id;}
    public void setId(Integer id) {this.id = id;}
    public String getName() {return name;}
    public void setName(String name) {this.name = name;}
    public String getCategory() {return category;}
    public void setCategory(String category) {this.category = category;}
    public float getPrice() {return price;}
    public void setPrice(float price) {this.price = price;}
    public Integer getQuantity() {return quantity;}
    public void setQuantity(Integer quantity) {this.quantity = quantity;}
    public String getSupplier() {return supplier;}
    public void setSupplier(String supplier) {this.supplier = supplier;}
    public String getBarcode() {return barcode;}
    public void setBarcode(String barcode) {this.barcode = barcode;}

}
