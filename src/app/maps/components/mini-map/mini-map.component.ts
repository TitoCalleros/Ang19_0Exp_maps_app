import { AfterViewInit, Component, ElementRef, input, signal, viewChild } from '@angular/core';
import mapboxgl, { LngLatLike } from 'mapbox-gl';
import { environment } from '../../../../environments/environment';

mapboxgl.accessToken = environment.mapboxKey;

@Component({
  selector: 'app-mini-map',
  imports: [],
  templateUrl: './mini-map.component.html',
  styleUrl: './mini-map.component.css'
})
export class MiniMapComponent implements AfterViewInit {

  divElement = viewChild<ElementRef>('map');

  property = input.required<LngLatLike>();
  zoom = input<number>(14);

  async ngAfterViewInit() {
    if (!this.divElement()) return;

    await new Promise( (resolve) => setTimeout(resolve, 80));

    const element = this.divElement()?.nativeElement;

    const map = new mapboxgl.Map({
      container: element, // container
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.property(), // starting position [lng, lat]
      zoom: this.zoom(), // starting zoom
      interactive: false,
      pitch: 40
    });

    console.log('Creacion de minimapa');

    this.addMarker(map);
    // new mapboxgl.Marker().setLngLat(this.property()).addTo(map);
  }

  addMarker(map: mapboxgl.Map) {
    if (!map) return;

    new mapboxgl.Marker().setLngLat(this.property()).addTo(map);
  }
 }
