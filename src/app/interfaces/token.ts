import { Component, OnInit } from '@angular/core';

export interface Token{
  access_token:string;
  accessTokenExpiresAt:string;
  redirect_uri:string;
}
