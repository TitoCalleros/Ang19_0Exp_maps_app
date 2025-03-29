import { AfterViewInit, Component, effect, ElementRef, signal, viewChild } from '@angular/core';
import mapboxgl from 'mapbox-gl';
import { environment } from '../../../environments/environment';
import { DecimalPipe, JsonPipe } from '@angular/common';

mapboxgl.accessToken = environment.mapboxKey;

@Component({
  selector: 'app-fullscreen-map-page',
  imports: [DecimalPipe, JsonPipe],
  templateUrl: './fullscreen-map-page.component.html',
  styleUrl: './fullscreen-map-page.component.css'
})
export class FullscreenMapPageComponent implements AfterViewInit {

  divElement = viewChild<ElementRef>('map');
  map = signal<mapboxgl.Map | null>(null)

  zoom = signal(16);
  coordinates = signal({
    lng: -99.1906,
    lat: 18.9685,
  });

  zoomEffect = effect( () => {
    if ( !this.map() ) return;

    this.map()?.setZoom(this.zoom());
  });

  async ngAfterViewInit() {
    if (!this.divElement()) return;

    await new Promise( (resolve) => setTimeout(resolve, 80));

    const element = this.divElement()?.nativeElement;
    const { lng, lat } = this.coordinates();

    const map = new mapboxgl.Map({
      container: element, // container
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: [lng, lat], // starting position [lng, lat]
      zoom: this.zoom(), // starting zoom
    });


    this.mapListeners(map);
  }

  mapListeners(map: mapboxgl.Map) {

    map.on('zoomend', (event) => {
      const newZoom = event.target.getZoom();
      this.zoom.set(newZoom);
    });

    map.on('moveend', () => {
      const center = map.getCenter();
      this.coordinates.set(center);
    })

    this.map.set(map);
  }

}
