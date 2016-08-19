Views
-----------

In our project, all HTML files are placed inside Views module.

auth.account.html
-----------

`auth.account.html` is the main template in `deep-account-adapter` microservice.

It is not a secret that one of the best UX enhancements is switching from one screen to other sliding left to right.

So, in this template, we are going to do it also using actions triggered by the ng-show directive.

We have 3 main sections:

Account section

    <ul class="account-block acc-box"
          ng-class="{'show-account-block in': 
          (accountCtrl.accountSettings && 
          !accountCtrl.propertySettings),
          'hide-account-block': 
          (accountCtrl.accountSettings && 
          accountCtrl.environmentsSettings && 
          accountCtrl.propertySettings)}"
          ng-show="accountCtrl.accountSettings">
          <h4 class="account">
              <i class="account-icon"></i>
              <span>Account</span>
              <a href="javascript:;" class="btn btn--m 
              btn--white btn--fab pull-right" 
              ng-click="accountCtrl.backButton()" 
              ng-show="!accountCtrl.propertySettings && 
              !accountCtrl.environmentsSettings" 
              <i class="mdi mdi-chevron-left"></i></a>
          </h4>
          ............
          ............
     </ul>

User section

    <ul class="property-block acc-box"
          ............
          ............
    </ul>

Role section

    <ul class="environments-block acc-box ribbon-cont disabled"
          ............
          ............
    </ul>


We will have just two animations.
One that will move the block to the left, and the other one will move to the right.

For example, Account Information can be accessed from Account block. That translates into moving from
`right to left` and `left to right` from back button, when we want to bring back all sections.
That is why we are using ng-class directive so we can get the right class to use from the model.

This is done within the controller:

    showAccountSettingsBlocks() {
        this.accountSettings = true;
        this.propertySettings = false;
        this.environmentsSettings = false;
     }
     .......
     .......


But all of this, without CSS Transitions is not possible.
CSS Transitions needed to move the screens from left to right and from right to left:

    .info-block.in {
      opacity: 1;
      left: 0;

      @include transition(opacity .5s ease-in);
      @include animation-duration(.5s);
      @include translate3d(0, 0, 0);
      @include animation-name(sf-slidein);

    }
     .........
     .........

