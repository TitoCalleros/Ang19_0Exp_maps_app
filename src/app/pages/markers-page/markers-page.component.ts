import { AfterViewInit, Component, ElementRef, signal, viewChild } from '@angular/core';
import mapboxgl from 'mapbox-gl';
import { environment } from '../../../environments/environment';
import { v4 as uuidv4 } from 'uuid';

mapboxgl.accessToken = environment.mapboxKey;

interface Marker {
  id: string;
  mapboxMarker: mapboxgl.Marker;
}


@Component({
  selector: 'app-markers-page',
  imports: [],
  templateUrl: './markers-page.component.html',
})
export class MarkersPageComponent implements AfterViewInit {
  divElement = viewChild<ElementRef>('map');
  map = signal<mapboxgl.Map | null>(null);
  markers = signal<Marker[]>([]);

  async ngAfterViewInit() {
    if (!this.divElement()?.nativeElement) return;

    await new Promise((resolve) => setTimeout(resolve, 80));

    const element = this.divElement()?.nativeElement;

    const map = new mapboxgl.Map({
      container: element, // container
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: [-99.1906, 18.9685], // starting position [lng, lat]
      zoom: 14, // starting zoom
    });

    // const newMarker = new mapboxgl.Marker({
    //   color: 'red',
    //   draggable: false,
    //   scale: 1,
    // }).setLngLat([-99.1906, 18.9685]).addTo(map);

    // newMarker.on('dragend', (event) => {
    //   console.log(event.target);

    // });

    this.mapListeners(map);
  }

  mapListeners(map: mapboxgl.Map) {
    map.on('click', (event ) => this.addMarker(event));

    this.map.set(map);
  }

  addMarker(event: mapboxgl.MapMouseEvent) {

    if (!this.map()) return;

    const map = this.map()!;

    const color = '#xxxxxx'.replace(/x/g, (y) =>
      ((Math.random() * 16) | 0).toString(16)
    );

    const mapboxMarker = new mapboxgl.Marker({
      color: color
    }).setLngLat(event.lngLat).addTo(map);

    const newMarker: Marker = {
      id: uuidv4(),
      mapboxMarker: mapboxMarker
    };

    // this.markers.set([newMarker, ...this.markers()]);
    this.markers.update(markers => [newMarker, ...markers]);
  }
}
